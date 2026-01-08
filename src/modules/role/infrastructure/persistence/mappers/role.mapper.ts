import { Prisma, Role as PrismaRole } from 'generated/prisma/client';
import { Role } from 'src/modules/role';

export class RoleMapper {
  static toDomain(raw: PrismaRole): Role {
    return Role.builder(raw.id, raw.organizationId, raw.roleName)
      .withTimestamps(raw.createdAt, raw.updatedAt)
      .build();
  }

  static toPersistence(role: Role): Prisma.RoleCreateInput {
    return {
      id: role.id,
      organization: {
        connect: { id: role.organizationId },
      },
      roleName: role.name,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  static toUpdatePersistence(role: Role): Prisma.RoleUpdateInput {
    return {
      roleName: role.name,
      updatedAt: role.updatedAt,
    };
  }

  static toUpsertArgs(role: Role): Prisma.RoleUpsertArgs {
    return {
      where: { id: role.id },
      create: this.toPersistence(role),
      update: this.toUpdatePersistence(role),
    };
  }
}
