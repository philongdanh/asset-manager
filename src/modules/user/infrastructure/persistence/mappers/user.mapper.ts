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
    },
  ): User {
    const builder = User.builder(
      prismaUser.id,
      prismaUser.organizationId,
      prismaUser.username,
      prismaUser.email,
      prismaUser.password,
    )
      .inDepartment(prismaUser.departmentId)
      .withStatus(prismaUser.status as UserStatus)
      .withTimestamps(
        prismaUser.createdAt,
        prismaUser.updatedAt,
        prismaUser.deletedAt,
      );

    return builder.build();
  }

  static toPersistence(user: User): Prisma.UserCreateInput {
    return {
      id: user.id,
      organization: {
        connect: { id: user.organizationId },
      },
      department: user.departmentId
        ? { connect: { id: user.departmentId } }
        : undefined,
      username: user.username,
      password: user.password,
      email: user.email,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }

  static toUpdatePersistence(user: User): Prisma.UserUpdateInput {
    const updateData: Prisma.UserUpdateInput = {
      username: user.username,
      email: user.email,
      status: user.status,
      updatedAt: user.updatedAt,
    };

    // Handle department relation update
    if (user.departmentId === null) {
      updateData.department = { disconnect: true };
    } else if (user.departmentId !== undefined) {
      updateData.department = { connect: { id: user.departmentId } };
    }

    // Handle deletedAt - only include if it's explicitly set
    if (user.deletedAt !== undefined) {
      updateData.deletedAt = user.deletedAt;
    }

    return updateData;
  }
}
