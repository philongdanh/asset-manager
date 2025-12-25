import {
  Prisma,
  Permission as PrismaPermission,
} from 'generated/prisma/client';
import { Permission } from 'src/domain/identity/permission';

export class PermissionMapper {
  static toDomain(prismaPermission: PrismaPermission): Permission {
    return Permission.builder(prismaPermission.id, prismaPermission.name)
      .withDescription(prismaPermission.description)
      .withTimestamps(prismaPermission.createdAt, prismaPermission.updatedAt)
      .build();
  }

  static toPersistence(permission: Permission): Prisma.PermissionCreateInput {
    return {
      id: permission.id,
      name: permission.name,
      description: permission.description,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }

  static toUpdatePersistence(
    permission: Permission,
  ): Prisma.PermissionUpdateInput {
    return {
      id: permission.id,
      name: permission.name,
      description: permission.description,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }

  static toUpsertArgs(permission: Permission): Prisma.PermissionUpsertArgs {
    return {
      where: { id: permission.id },
      create: this.toPersistence(permission),
      update: this.toUpdatePersistence(permission),
    };
  }
}
