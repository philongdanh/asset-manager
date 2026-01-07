import { Injectable } from '@nestjs/common';
import { IRoleRepository, Role } from '../../../domain';
import { PrismaService } from 'src/shared/infrastructure/prisma';
import { RoleMapper } from '../mappers/role.mapper';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class PrismaRoleRepository implements IRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  // --- Query Methods ---
  async find(organizationId: string): Promise<{ data: Role[]; total: number }> {
    const where: Prisma.RoleWhereInput = { organizationId };
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

  async findById(
    roleId: string,
    organizationId?: string,
  ): Promise<Role | null> {
    const where: Prisma.RoleWhereInput = { id: roleId };
    if (organizationId) {
      where.organizationId = organizationId;
    }
    const role = await this.prisma.role.findUnique({
      where: { id: roleId }, // findUnique only works with unique constraints. To check orgId, use findFirst with strict condition or check after fetch.
      // Correction: Prisma findUnique only allows unique fields in where. I cannot pass organizationId strictly in where of findUnique.
      // Better approach: use findFirst if organizationId is present, or findUnique if not. But findFirst is safer for generic where.
    });

    // Strategy 2: Fetch by ID then check OrganizationID in application layer or use findFirst.
    // Using findFirst is cleaner for "WHERE id = ? AND organizationId = ?" style.
    if (organizationId) {
      const roleScoped = await this.prisma.role.findFirst({
        where: { id: roleId, organizationId },
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      });
      return roleScoped ? RoleMapper.toDomain(roleScoped) : null;
    }

    // Default behavior if no organizationId passed (Root user or unsafe context) - Fallback to original findUnique
    const roleUnscoped = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    return roleUnscoped ? RoleMapper.toDomain(roleUnscoped) : null;
  }

  async findByUserId(userId: string): Promise<Role[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
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
    const roles = await this.prisma.role.findMany({
      where: {
        rolePermissions: {
          some: {
            permissionId,
          },
        },
      },
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
    const count = await this.prisma.role.count({
      where: { id: roleId },
    });
    return count > 0;
  }

  // --- Persistence Methods ---
  async save(role: Role): Promise<Role> {
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
    await this.prisma.$transaction([
      this.prisma.rolePermission.deleteMany({
        where: { roleId: { in: roleIds } },
      }),
      this.prisma.userRole.deleteMany({
        where: { roleId: { in: roleIds } },
      }),
      this.prisma.role.deleteMany({
        where: { id: { in: roleIds } },
      }),
    ]);
  }

  async getRolePermissions(roleId: string): Promise<string[]> {
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { roleId },
      select: { permissionId: true },
    });
    return rolePermissions.map((rp) => rp.permissionId);
  }

  async hasPermission(roleId: string, permissionId: string): Promise<boolean> {
    const count = await this.prisma.rolePermission.count({
      where: {
        roleId,
        permissionId,
      },
    });
    return count > 0;
  }

  async assignPermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<void> {
    if (permissionIds.length === 0) return;

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

    await this.prisma.userRole.deleteMany({
      where: {
        roleId,
        userId: { in: userIds },
      },
    });
  }
}
