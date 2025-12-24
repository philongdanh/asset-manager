import { Prisma } from 'generated/prisma/browser';
import { Role as PrismaRole } from 'generated/prisma/client';
import { Role } from 'src/domain/identity/role';

export class RoleMapper {
  static toDomain(prismaRole: PrismaRole): Role {
    const builder = Role.builder(
      prismaRole.id,
      prismaRole.organizationId,
      prismaRole.roleName,
    ).withTimestamps(prismaRole.createdAt, prismaRole.updatedAt);

    return builder.build();
  }

  static toPersistence(role: Role) {
    const roleCreateArgs: Prisma.RoleCreateArgs = {
      data: {
        id: role.id,
        organizationId: role.organizationId,
        roleName: role.roleName,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      },
    };
    return roleCreateArgs.data;
  }
}
