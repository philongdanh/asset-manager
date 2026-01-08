import { Injectable } from '@nestjs/common';
import { IRoleRepository, Role } from '../../../domain';
import { PrismaService } from 'src/shared/infrastructure/prisma';
import { RoleMapper } from '../mappers/role.mapper';
import { Prisma } from 'generated/prisma/client';
import { BaseRepository } from 'src/shared/infrastructure/prisma/base.repository';
import { TenantContextService } from 'src/shared/infrastructure/context/tenant-context.service';

@Injectable()
export class PrismaRoleRepository
  extends BaseRepository
  implements IRoleRepository
{
  constructor(
    readonly tCtx: TenantContextService,
    private readonly prisma: PrismaService,
  ) {
    super(tCtx);
  }

  // --- Query Methods ---
  async find(): Promise<Role[]> {
    const roles = await this.prisma.role.findMany({
      where: this.applyTenantFilter<Prisma.RoleWhereInput>({}),
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return roles.map((role) => RoleMapper.toDomain(role));
  }

  async findById(id: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: this.applyTenantFilter<Prisma.RoleWhereUniqueInput>({ id }),
    });
    return role ? RoleMapper.toDomain(role) : null;
  }

  async findByPerms(permIds: string[]): Promise<Role[]> {
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: {
        permissionId: {
          in: permIds,
        },
      },
      include: {
        role: true,
      },
    });
    return rolePermissions.map((rp) => RoleMapper.toDomain(rp.role));
  }

  async findByUser(userId: string): Promise<Role[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: this.applyTenantFilter<Prisma.UserRoleWhereInput>({ userId }),
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    return userRoles.map((userRole) => RoleMapper.toDomain(userRole.role));
  }

  // --- Validation Methods ---
  async existsById(roleId: string): Promise<boolean> {
    const count = await this.prisma.role.count({
      where: this.applyTenantFilter<Prisma.RoleWhereInput>({ id: roleId }),
    });
    return count > 0;
  }

  // --- Persistence Methods ---
  async save(role: Role): Promise<Role> {
    // For update operations, verify the role belongs to current tenant
    const existingRole = await this.prisma.role.findUnique({
      where: this.applyTenantFilter<Prisma.RoleWhereUniqueInput>({
        id: role.id,
      }),
      select: { id: true, organizationId: true },
    });

    if (existingRole) {
      // Update case: verify tenant ownership
      const tenantId = this.tenantContext.getTenantId();
      if (tenantId && existingRole.organizationId !== tenantId) {
        throw new Error('Role not found or access denied');
      }
    }

    const upsertArgs = RoleMapper.toUpsertArgs(role);
    const savedRole = await this.prisma.role.upsert({
      ...upsertArgs,
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    return RoleMapper.toDomain(savedRole);
  }

  async delete(roleIds: string[]): Promise<void> {
    if (roleIds.length === 0) return;

    // Safety check: ensure all roleIds belong to the current organization
    const tenantFilter = this.getTenantFilter();

    await this.prisma.$transaction([
      this.prisma.rolePermission.deleteMany({
        where: {
          roleId: { in: roleIds },
          role: tenantFilter,
        },
      }),
      this.prisma.userRole.deleteMany({
        where: {
          roleId: { in: roleIds },
          role: tenantFilter,
        },
      }),
      this.prisma.role.deleteMany({
        where: {
          id: { in: roleIds },
          ...tenantFilter,
        },
      }),
    ]);
  }

  async getRolePermissions(roleId: string): Promise<string[]> {
    const where = this.applyTenantFilter<Prisma.RoleWhereInput>({ id: roleId });
    const role = await this.prisma.role.findFirst({
      where,
      select: {
        rolePermissions: {
          select: { permissionId: true },
        },
      },
    });

    return role?.rolePermissions.map((rp) => rp.permissionId) || [];
  }

  async hasPerm(roleId: string, permissionId: string): Promise<boolean> {
    const where = this.applyTenantFilter<Prisma.RoleWhereInput>({
      id: roleId,
      rolePermissions: {
        some: { permissionId },
      },
    });

    const count = await this.prisma.role.count({ where });
    return count > 0;
  }

  async attachPerms(roleId: string, permissionIds: string[]): Promise<void> {
    if (permissionIds.length === 0) return;

    // Verify role belongs to tenant
    const exists = await this.existsById(roleId);
    if (!exists) throw new Error('Role not found or access denied');

    const createOperations = permissionIds.map((permissionId) => ({
      roleId,
      permissionId,
    }));

    await this.prisma.rolePermission.createMany({
      data: createOperations,
      skipDuplicates: true,
    });
  }

  async detachPerms(roleId: string, permissionIds: string[]): Promise<void> {
    if (permissionIds.length === 0) return;

    // Verify role belongs to tenant
    const exists = await this.existsById(roleId);
    if (!exists) throw new Error('Role not found or access denied');

    // Apply tenant filter via role relation
    const tenantFilter = this.getTenantFilter();
    await this.prisma.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId: { in: permissionIds },
        role: tenantFilter,
      },
    });
  }

  // --- User-Role Management ---
  async assignToUsers(roleId: string, userIds: string[]): Promise<void> {
    if (userIds.length === 0) return;

    // Verify role belongs to tenant
    const exists = await this.existsById(roleId);
    if (!exists) throw new Error('Role not found or access denied');

    const createOperations = userIds.map((userId) => ({
      roleId,
      userId,
    }));

    await this.prisma.userRole.createMany({
      data: createOperations,
      skipDuplicates: true,
    });
  }

  async removeFromUsers(roleId: string, userIds: string[]): Promise<void> {
    if (userIds.length === 0) return;

    // Verify role belongs to tenant
    const exists = await this.existsById(roleId);
    if (!exists) throw new Error('Role not found or access denied');

    // Apply tenant filter via role relation
    const tenantFilter = this.getTenantFilter();
    await this.prisma.userRole.deleteMany({
      where: {
        roleId,
        userId: { in: userIds },
        role: tenantFilter,
      },
    });
  }
}
