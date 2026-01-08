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
  implements IRoleRepository {
  constructor(
    private readonly prisma: PrismaService,
    tenantContext: TenantContextService,
  ) {
    super(tenantContext);
  }

  // --- Query Methods ---
  async find(filter?: {
    organizationId?: string;
  }): Promise<{ data: Role[]; total: number }> {
    const where = this.applyTenantFilter<Prisma.RoleWhereInput>({
      organizationId: filter?.organizationId,
    });

    const [data, total] = await Promise.all([
      this.prisma.role.findMany({
        where,
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      }),
      this.prisma.role.count({ where }),
    ]);

    return {
      data: data.map((role) => RoleMapper.toDomain(role)),
      total,
    };
  }

  async findById(roleId: string): Promise<Role | null> {
    const where = this.applyTenantFilter<Prisma.RoleWhereInput>({ id: roleId });

    const role = await this.prisma.role.findFirst({
      where,
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return role ? RoleMapper.toDomain(role) : null;
  }

  async findByUserId(userId: string): Promise<Role[]> {
    // UserRole relationship implicitly handles the tenant if roles are correctly scoped.
    // But we might want to ensure the resulting roles belong to the current tenant.
    const userRoles = await this.prisma.userRole.findMany({
      where: {
        userId,
        role: this.getTenantFilter(),
      },
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

  async findByPermission(permissionId: string): Promise<Role[]> {
    const where = this.applyTenantFilter<Prisma.RoleWhereInput>({
      rolePermissions: {
        some: {
          permissionId,
        },
      },
    });

    const roles = await this.prisma.role.findMany({
      where,
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    return roles.map((role) => RoleMapper.toDomain(role));
  }

  // --- Validation Methods ---
  async existsById(roleId: string): Promise<boolean> {
    const where = this.applyTenantFilter<Prisma.RoleWhereInput>({ id: roleId });
    const count = await this.prisma.role.count({ where });
    return count > 0;
  }

  // --- Persistence Methods ---
  async save(role: Role): Promise<Role> {
    // Ensure the domain object has the correct organizationId from context
    const tenantId = this.tenantContext.getTenantId();
    if (tenantId) {
      // Technically domain objects should be immutable, but here we're ensuring persistence safety.
      // Assuming Role has a way to set organizationId or it's handled in the mapper.
      (role as any).organizationId = tenantId;
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

  async hasPermission(roleId: string, permissionId: string): Promise<boolean> {
    const where = this.applyTenantFilter<Prisma.RoleWhereInput>({
      id: roleId,
      rolePermissions: {
        some: { permissionId },
      },
    });

    const count = await this.prisma.role.count({ where });
    return count > 0;
  }

  async assignPermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<void> {
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

  async removePermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<void> {
    if (permissionIds.length === 0) return;

    // Verify role belongs to tenant
    const exists = await this.existsById(roleId);
    if (!exists) throw new Error('Role not found or access denied');

    await this.prisma.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId: { in: permissionIds },
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

    await this.prisma.userRole.deleteMany({
      where: {
        roleId,
        userId: { in: userIds },
      },
    });
  }
}
