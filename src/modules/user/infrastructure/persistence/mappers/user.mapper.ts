import {
  Prisma,
  User as PrismaUser,
  UserRole as PrismaUserRole,
  Role as PrismaRole,
} from 'generated/prisma/client';
import { User, UserStatus } from '../../../domain';

export class UserMapper {
  static toDomain(
    prismaUser: PrismaUser & {
      userRoles?: (PrismaUserRole & { role?: PrismaRole })[];
      department?: { name: string; parentId: string | null } | null;
    },
  ): User {
    // toDomain update
    /* ... inside builder ... */
    const builder = User.builder(
      prismaUser.id,
      prismaUser.organizationId,
      prismaUser.username,
      prismaUser.email,
      prismaUser.password,
    )
      .inDepartment(
        prismaUser.departmentId,
        prismaUser.department?.name || null,
        prismaUser.department?.parentId || null,
      )
      .withStatus(prismaUser.status as UserStatus)
      .withTimestamps(
        prismaUser.createdAt,
        prismaUser.updatedAt,
        prismaUser.deletedAt,
      )
      .asRoot(prismaUser.isRoot)
      .withRefreshToken(prismaUser.hashedRefreshToken)
      .withAvatarUrl(prismaUser.avatarUrl)
      .withProfile(
        prismaUser.fullName,
        prismaUser.dateOfBirth,
        prismaUser.gender,
        prismaUser.phoneNumber,
      );

    return builder.build();
  }

  static toPersistence(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id,
      organizationId: user.organizationId,
      departmentId: user.departmentId,
      username: user.username,
      password: user.password,
      email: user.email,
      status: user.status,
      isRoot: user.isRoot,
      hashedRefreshToken: user.hashedRefreshToken,
      avatarUrl: user.avatarUrl,
      fullName: user.fullName,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }

  static toUpdatePersistence(user: User): Prisma.UserUncheckedUpdateInput {
    const updateData: Prisma.UserUncheckedUpdateInput = {
      username: user.username,
      email: user.email,
      status: user.status,
      isRoot: user.isRoot,
      hashedRefreshToken: user.hashedRefreshToken,
      avatarUrl: user.avatarUrl,
      fullName: user.fullName,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      updatedAt: user.updatedAt,
      departmentId: user.departmentId,
    };

    // Handle deletedAt - only include if it's explicitly set
    if (user.deletedAt !== undefined) {
      updateData.deletedAt = user.deletedAt;
    }

    return updateData;
  }

  static toUpsertArgs(user: User): Prisma.UserUpsertArgs {
    return {
      where: { id: user.id },
      create: this.toPersistence(user),
      update: this.toUpdatePersistence(user),
    };
  }
}
