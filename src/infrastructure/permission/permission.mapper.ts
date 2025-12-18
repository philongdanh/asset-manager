import {
  Permission as PrismaPermission,
  Role as PrismaRole,
  RolePermission as PrismaRolePermission,
} from 'generated/prisma/client';
import { Permission } from 'src/domain/identity/permission';
import { Role } from 'src/domain/identity/role';

type PrismaPermissionWithRoles = PrismaPermission & {
  rolePermissions?: (PrismaRolePermission & {
    role: PrismaRole;
  })[];
};

export class PermissionMapper {
  static toDomain(prismaPermission: PrismaPermissionWithRoles): Permission {
    const roles =
      prismaPermission.rolePermissions?.map((rp) => {
        // Manually map Role to avoid circular dependency with RoleMapper
        // and to prevent infinite recursion if we used RoleMapper.toDomain (which maps permissions)
        return new Role(
          rp.role.id,
          rp.role.organizationId,
          rp.role.roleName,
          [], // We don't map permissions of the role here to avoid cycle
        );
      }) ?? [];

    return new Permission(
      prismaPermission.id,
      prismaPermission.name,
      prismaPermission.description ?? '',
      roles,
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
