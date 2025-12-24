import { Prisma, User as PrismaUser } from 'generated/prisma/browser';
import { User, UserStatus } from 'src/domain/identity/user';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return User.builder(
      prismaUser.id,
      prismaUser.organizationId,
      prismaUser.username,
      prismaUser.email,
    )
      .inDepartment(prismaUser.departmentId)
      .withStatus(prismaUser.status as UserStatus)
      .withTimestamps(
        prismaUser.createdAt,
        prismaUser.updatedAt,
        prismaUser.deletedAt,
      )
      .build();
  }

  static toPersistence(user: User): Prisma.UserUpsertArgs {
    return {
      where: {
        id: user.id,
      },
      create: {
        organizationId: user.organizationId,
        departmentId: user.departmentId,
        username: user.username,
        email: user.email,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      },
      update: {
        organizationId: user.organizationId,
        departmentId: user.departmentId,
        username: user.username,
        email: user.email,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      },
    };
  }
}
