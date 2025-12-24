import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/browser';
import { PrismaService } from '..';
import { IUserRepository, User, UserStatus } from 'src/domain/identity/user';
import { Role } from 'src/domain/identity/role';
import { UserMapper } from '../../../mappers/user.mapper';
import { RoleMapper } from '../../../identity/role';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  // --- Query Methods ---
  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
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
    organizationId: string,
    username: string,
  ): Promise<User | null> {
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
  }

  async findAll(
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
        include: { userRoles: { include: { role: true } } },
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
      where: { departmentId },
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
      where: { organizationId },
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
      },
      include: { userRoles: { include: { role: true } } },
    });
    return users.map((user) => UserMapper.toDomain(user));
  }

  // --- Validation Methods ---
  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
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
      },
    });
    return count > 0;
  }

  async existsById(userId: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { id: userId },
    });
    return count > 0;
  }

  // --- Persistence Methods ---
  async save(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const savedUser = await this.prisma.user.upsert(data);
    return UserMapper.toDomain(savedUser);
  }

  async update(user: User): Promise<User> {
    return this.save(user);
  }

  async saveMany(users: User[]): Promise<void> {
    const transactions = users.map((user) => {
      const data = UserMapper.toPersistence(user);
      return this.prisma.user.upsert(data);
    });
    await this.prisma.$transaction(transactions);
  }

  async delete(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });
  }

  async deleteMany(userIds: string[]): Promise<void> {
    await this.prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: { deletedAt: new Date() },
    });
  }

  async hardDelete(userId: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async hardDeleteMany(userIds: string[]): Promise<void> {
    await this.prisma.user.deleteMany({
      where: { id: { in: userIds } },
    });
  }

  async restore(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: null },
    });
  }

  async restoreMany(userIds: string[]): Promise<void> {
    await this.prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: { deletedAt: null },
    });
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
    await this.prisma.userRole.deleteMany({
      where: {
        userId,
        roleId: { in: roleIds },
      },
    });
  }

  async updateRoles(userId: string, roleIds: string[]): Promise<void> {
    // Xóa tất cả roles hiện tại
    await this.prisma.userRole.deleteMany({
      where: { userId },
    });

    // Thêm roles mới
    if (roleIds.length > 0) {
      await this.assignRoles(userId, roleIds);
    }
  }

  async getUserRoles(userId: string): Promise<string[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      select: { roleId: true },
    });
    return userRoles.map((ur) => ur.roleId);
  }

  async hasRole(userId: string, roleId: string): Promise<boolean> {
    const count = await this.prisma.userRole.count({
      where: { userId, roleId },
    });
    return count > 0;
  }

  async getRolesByUserId(userId: string): Promise<Role[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });
    return userRoles.map((userRole) => RoleMapper.toDomain(userRole.role));
  }

  // --- User-Asset Management ---
  async getAssignedAssets(userId: string): Promise<string[]> {
    const assets = await this.prisma.asset.findMany({
      where: { currentUserId: userId },
      select: { id: true },
    });
    return assets.map((asset) => asset.id);
  }

  async getCreatedAssets(userId: string): Promise<string[]> {
    const assets = await this.prisma.asset.findMany({
      where: { createdByUserId: userId },
      select: { id: true },
    });
    return assets.map((asset) => asset.id);
  }

  // --- Special Methods ---
  async getUsersSummary(organizationId: string): Promise<{
    totalCount: number;
    byStatus: Record<UserStatus, number>;
    byDepartment: Record<string, number>;
    withAssetsCount: number;
  }> {
    const [users, departmentGroups, withAssetsCount] = await Promise.all([
      this.prisma.user.findMany({
        where: { organizationId },
      }),

      this.prisma.user.groupBy({
        by: ['departmentId'],
        _count: true,
        where: { organizationId, deletedAt: null },
      }),

      this.prisma.user.count({
        where: {
          organizationId,
          deletedAt: null,
          currentAssets: { some: {} },
        },
      }),
    ]);

    // Tính toán status dựa trên deletedAt
    const activeCount = users.filter((user) => !user.deletedAt).length;
    const deletedCount = users.filter((user) => user.deletedAt).length;

    const byStatus: Record<UserStatus, number> = {
      [UserStatus.ACTIVE]: activeCount,
      [UserStatus.INACTIVE]: 0,
      [UserStatus.SUSPENDED]: 0,
      [UserStatus.PENDING]: 0,
      [UserStatus.DELETED]: deletedCount,
    };

    const byDepartment: Record<string, number> = {};
    departmentGroups.forEach((group) => {
      const key = group.departmentId || 'No Department';
      byDepartment[key] = group._count;
    });

    return {
      totalCount: users.length,
      byStatus,
      byDepartment,
      withAssetsCount,
    };
  }

  async findUsersWithoutDepartment(organizationId: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        organizationId,
        departmentId: null,
        deletedAt: null,
      },
      include: { userRoles: { include: { role: true } } },
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
      },
      include: { userRoles: { include: { role: true } } },
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
    };

    if (daysThreshold) {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - daysThreshold);
      where.updatedAt = { lt: dateThreshold };
    }

    const users = await this.prisma.user.findMany({
      where,
      include: { userRoles: { include: { role: true } } },
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
      },
      include: { userRoles: { include: { role: true } } },
    });
    return users.map((user) => UserMapper.toDomain(user));
  }

  async searchUsersByKeyword(
    organizationId: string,
    keyword: string,
  ): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        organizationId,
        OR: [
          { username: { contains: keyword, mode: 'insensitive' } },
          { email: { contains: keyword, mode: 'insensitive' } },
        ],
        deletedAt: null,
      },
      include: { userRoles: { include: { role: true } } },
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
        permissions.add(rp.permission.name);
      });
    });

    return Array.from(permissions);
  }

  async getUserActivitySummary(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    assetsAssigned: number;
    assetsTransferred: number;
    maintenancePerformed: number;
    documentsUploaded: number;
    inventoryChecks: number;
  }> {
    const [
      assetsAssigned,
      assetsTransferred,
      maintenancePerformed,
      documentsUploaded,
      inventoryChecks,
    ] = await Promise.all([
      // Assets assigned to user
      this.prisma.asset.count({
        where: {
          currentUserId: userId,
          updatedAt: { gte: startDate, lte: endDate },
        },
      }),

      // Assets transferred by/to user
      this.prisma.assetTransfer.count({
        where: {
          OR: [{ fromUserId: userId }, { toUserId: userId }],
          transferDate: { gte: startDate, lte: endDate },
        },
      }),

      // Maintenance performed by user
      this.prisma.maintenanceSchedule.count({
        where: {
          performedByUserId: userId,
          actualDate: { gte: startDate, lte: endDate },
        },
      }),

      // Documents uploaded by user
      this.prisma.assetDocument.count({
        where: {
          uploadedByUserId: userId,
          uploadDate: { gte: startDate, lte: endDate },
        },
      }),

      // Inventory checks performed by user
      this.prisma.inventoryDetail.count({
        where: {
          checkedByUserId: userId,
          checkedDate: { gte: startDate, lte: endDate },
        },
      }),
    ]);

    return {
      assetsAssigned,
      assetsTransferred,
      maintenancePerformed,
      documentsUploaded,
      inventoryChecks,
    };
  }

  // --- Count Method (from existing implementation) ---
  async countByOrganizationId(organizationId: string): Promise<number> {
    return this.prisma.user.count({
      where: { organizationId },
    });
  }
}
