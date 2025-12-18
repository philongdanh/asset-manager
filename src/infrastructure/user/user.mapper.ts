import { User as PrismaUser } from 'generated/prisma/client';
import { User } from 'src/domain/identity/user';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return new User(
      prismaUser.id,
      prismaUser.organizationId,
      prismaUser.username,
      prismaUser.email,
      prismaUser.departmentId,
    );
  }

  static toPersistence(user: User): PrismaUser {
    return {
      id: user.id,
      organizationId: user.organizationId,
      departmentId: user.departmentId,
      username: user.username,
      email: user.email,
    };
  }
}
