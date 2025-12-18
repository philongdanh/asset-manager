import {
  Role as PrismaRole,
  RolePermission as PrismaRolePermission,
  Permission as PrismaPermission,
} from 'generated/prisma/client';
import { Role } from 'src/domain/role';
import { PermissionMapper } from '../permission/permission.mapper';

type PrismaRoleWithPermissions = PrismaRole & {
  rolePermissions: (PrismaRolePermission & {
    permission: PrismaPermission;
  })[];
};

export class RoleMapper {
  static toDomain(prismaRole: PrismaRoleWithPermissions): Role {
    const permissions = prismaRole.rolePermissions.map((rp) =>
      PermissionMapper.toDomain(rp.permission),
    );
    return new Role(
      prismaRole.id,
      prismaRole.organizationId,
      prismaRole.roleName,
      permissions,
    );
  }

  static toPersistence(domainRole: Role): PrismaRole {
    return {
      id: domainRole.id,
      organizationId: domainRole.organizationId,
      roleName: domainRole.name,
    };
  }
}
