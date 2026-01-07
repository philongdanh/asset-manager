import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { IUserRepository, User, UserStatus } from '../../../domain';
import { RoleMapper } from 'src/modules/role/infrastructure';
import { UserMapper } from '../mappers/user.mapper';
import { PrismaService } from 'src/shared/infrastructure/prisma';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) { }

  // --- Query Methods ---
  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        organization: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByUsername(
    organizationId: string | null,
    username: string,
  ): Promise<User | null> {
    if (organizationId) {
      const user = await this.prisma.user.findUnique({
        where: {
          organizationId_username: {
            organizationId,
            username,
          },
        },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
        },
      });
      return user ? UserMapper.toDomain(user) : null;
    } else {
      const user = await this.prisma.user.findFirst({
        where: {
          username,
          OR: [{ organizationId: null }, { isRoot: true }],
          deletedAt: null, // Good practice to include deletedAt check finding by non-unique
        },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
        },
      });
      return user ? UserMapper.toDomain(user) : null;
    }
  }

  async find(
    organizationId: string,
    options?: {
      departmentId?: string;
      status?: UserStatus;
      roleId?: string;
      search?: string;
      limit?: number;
      offset?: number;
      includeDeleted?: boolean;
    },
  ): Promise<{ data: User[]; total: number }> {
    const where: Prisma.UserWhereInput = { organizationId };

    // Apply filters
    if (options?.departmentId) {
      where.departmentId = options.departmentId;
    }
    if (options?.status) {
      where.status = options.status;
    }
    if (options?.roleId) {
      where.userRoles = {
        some: {
          roleId: options.roleId,
        },
      };
    }
    if (options?.search) {
      where.OR = [
        { username: { contains: options.search, mode: 'insensitive' } },
        { email: { contains: options.search, mode: 'insensitive' } },
      ];
    }
    if (!options?.includeDeleted) {
      where.deletedAt = null;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: options?.offset || 0,
        take: options?.limit || 100,
        orderBy: { createdAt: 'desc' },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map((user) => UserMapper.toDomain(user)),
      total,
    };
  }

  async findByDepartment(departmentId: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        departmentId,
        deletedAt: null,
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
    return users.map((user) => UserMapper.toDomain(user));
  }

  async findByOrganization(organizationId: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
    return users.map((user) => UserMapper.toDomain(user));
  }

  async findByRole(roleId: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        userRoles: {
          some: { roleId },
        },
        deletedAt: null,
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
    return users.map((user) => UserMapper.toDomain(user));
  }

  async findUsersWithRole(
    roleName: string,
    organizationId: string,
  ): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        organizationId,
        userRoles: {
          some: {
            role: {
              roleName,
            },
          },
        },
        deletedAt: null,
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
    return users.map((user) => UserMapper.toDomain(user));
  }

  // --- Validation Methods ---
  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: {
        email,
        deletedAt: null,
      },
    });
    return count > 0;
  }

  async existsByUsername(
    organizationId: string,
    username: string,
  ): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: {
        organizationId,
        username,
        deletedAt: null,
      },
    });
    return count > 0;
  }

  async existsById(userId: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: {
        id: userId,
        deletedAt: null,
      },
    });
    return count > 0;
  }

  // --- Persistence Methods ---
  async save(user: User): Promise<User> {
    const upsertArgs = UserMapper.toUpsertArgs(user);
    const savedUser = await this.prisma.user.upsert({
      ...upsertArgs,
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
    return UserMapper.toDomain(savedUser);
  }

  async update(user: User): Promise<User> {
    const data = UserMapper.toUpdatePersistence(user);
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data,
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
    return UserMapper.toDomain(updatedUser);
  }

  async saveMany(users: User[]): Promise<void> {
    await this.prisma.$transaction(
      users.map((user) => {
        const upsertArgs = UserMapper.toUpsertArgs(user);
        return this.prisma.user.upsert(upsertArgs);
      }),
    );
  }

  async delete(userId: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) return;

    user.markAsDeleted();
    await this.update(user);
  }

  async deleteMany(userIds: string[]): Promise<void> {
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
    });

    await this.prisma.$transaction(
      users.map((prismaUser) => {
        const user = UserMapper.toDomain(prismaUser);
        user.markAsDeleted();
        const data = UserMapper.toUpdatePersistence(user);
        return this.prisma.user.update({
          where: { id: user.id },
          data,
        });
      }),
    );
  }

  async hardDelete(userId: string): Promise<void> {
    // First delete dependent records
    await this.prisma.$transaction([
      this.prisma.userRole.deleteMany({
        where: { userId },
      }),
      this.prisma.user.delete({
        where: { id: userId },
      }),
    ]);
  }

  async hardDeleteMany(userIds: string[]): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.userRole.deleteMany({
        where: { userId: { in: userIds } },
      }),
      this.prisma.user.deleteMany({
        where: { id: { in: userIds } },
      }),
    ]);
  }

  async restore(userId: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) return;

    user.restore();
    await this.update(user);
  }

  async restoreMany(userIds: string[]): Promise<void> {
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
    });

    await this.prisma.$transaction(
      users.map((prismaUser) => {
        const user = UserMapper.toDomain(prismaUser);
        user.restore();
        const data = UserMapper.toUpdatePersistence(user);
        return this.prisma.user.update({
          where: { id: user.id },
          data,
        });
      }),
    );
  }

  // --- User-Role Management ---
  async assignRole(userId: string, roleId: string): Promise<void> {
    await this.prisma.userRole.upsert({
      where: {
        userId_roleId: { userId, roleId },
      },
      update: {},
      create: { userId, roleId },
    });
  }

  async assignRoles(userId: string, roleIds: string[]): Promise<void> {
    if (roleIds.length === 0) return;

    const createOperations = roleIds.map((roleId) => ({
      userId,
      roleId,
    }));

    await this.prisma.userRole.createMany({
      data: createOperations,
      skipDuplicates: true,
    });
  }

  async removeRole(userId: string, roleId: string): Promise<void> {
    await this.prisma.userRole.delete({
      where: {
        userId_roleId: { userId, roleId },
      },
    });
  }

  async removeRoles(userId: string, roleIds: string[]): Promise<void> {
    if (roleIds.length === 0) return;

    await this.prisma.userRole.deleteMany({
      where: {
        userId,
        roleId: { in: roleIds },
      },
    });
  }

  async updateRoles(userId: string, roleIds: string[]): Promise<void> {
    await this.prisma.$transaction([
      // Delete existing roles
      this.prisma.userRole.deleteMany({
        where: { userId },
      }),
      // Add new roles if any
      ...(roleIds.length > 0
        ? [
          this.prisma.userRole.createMany({
            data: roleIds.map((roleId) => ({ userId, roleId })),
          }),
        ]
        : []),
    ]);
  }

  async getUserRoles(
    userId: string,
  ): Promise<{ id: string; name: string; permissionIds: string[] }[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            rolePermissions: {
              select: {
                permissionId: true,
              },
            },
          },
        },
      },
    });
    return userRoles.map((ur) => ({
      id: ur.roleId,
      name: ur.role.roleName,
      permissionIds: ur.role.rolePermissions.map((perm) => perm.permissionId),
    }));
  }

  async hasRole(userId: string, roleId: string): Promise<boolean> {
    const count = await this.prisma.userRole.count({
      where: { userId, roleId },
    });
    return count > 0;
  }

  async getRolesByUserId(
    userId: string,
  ): Promise<import('src/modules/role/domain').Role[]> {
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

  // --- User-Asset Management ---
  async getAssignedAssets(userId: string): Promise<string[]> {
    const assets = await this.prisma.asset.findMany({
      where: {
        currentUserId: userId,
        deletedAt: null,
      },
      select: { id: true },
    });
    return assets.map((asset) => asset.id);
  }

  async getCreatedAssets(userId: string): Promise<string[]> {
    const assets = await this.prisma.asset.findMany({
      where: {
        createdByUserId: userId,
        deletedAt: null,
      },
      select: { id: true },
    });
    return assets.map((asset) => asset.id);
  }

  async findUsersWithoutDepartment(organizationId: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        organizationId,
        departmentId: null,
        deletedAt: null,
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
    return users.map((user) => UserMapper.toDomain(user));
  }

  async findInactiveUsers(daysThreshold: number): Promise<User[]> {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - daysThreshold);

    const users = await this.prisma.user.findMany({
      where: {
        status: UserStatus.INACTIVE,
        updatedAt: { lt: dateThreshold },
        deletedAt: null,
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    return users.map((user) => UserMapper.toDomain(user));
  }

  async findInactiveUsersByOrganization(
    organizationId: string,
    daysThreshold?: number,
  ): Promise<User[]> {
    const where: Prisma.UserWhereInput = {
      organizationId,
      status: UserStatus.INACTIVE,
      deletedAt: null,
    };

    if (daysThreshold) {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - daysThreshold);
      where.updatedAt = { lt: dateThreshold };
    }

    const users = await this.prisma.user.findMany({
      where,
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    return users.map((user) => UserMapper.toDomain(user));
  }

  async findUsersByAsset(assetId: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { currentAssets: { some: { id: assetId } } },
          { createdAssets: { some: { id: assetId } } },
        ],
        deletedAt: null,
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
    return users.map((user) => UserMapper.toDomain(user));
  }

  async getUserPermissions(userId: string): Promise<string[]> {
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

    const permissions = new Set<string>();
    userRoles.forEach((userRole) => {
      userRole.role.rolePermissions.forEach((rp) => {
        if (rp.permission) {
          permissions.add(rp.permission.name);
        }
      });
    });

    return Array.from(permissions);
  }
}
