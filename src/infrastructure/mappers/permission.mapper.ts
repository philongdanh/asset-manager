import {
  Permission as PrismaPermission,
  Role as PrismaRole,
  RolePermission as PrismaRolePermission,
} from 'generated/prisma/client';
import { Permission } from 'src/domain/identity/permission';

type PrismaPermissionWithRoles = PrismaPermission & {
  rolePermissions?: (PrismaRolePermission & {
    role: PrismaRole;
  })[];
};

export class PermissionMapper {
  static toDomain(prismaPermission: PrismaPermissionWithRoles): Permission {
    return new Permission(
      prismaPermission.id,
      prismaPermission.name,
      prismaPermission.description ?? '',
      [],
    );
  }

  static toPersistence(domainPermission: Permission): PrismaPermission {
    return {
      id: domainPermission.id,
      name: domainPermission.name,
      description: domainPermission.description,
    };
  }
}
