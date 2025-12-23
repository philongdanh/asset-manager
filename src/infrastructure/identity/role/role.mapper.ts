import { Role as PrismaRole } from 'generated/prisma/client';
import { Role } from 'src/domain/identity/role';

export class RoleMapper {
  static toDomain(prismaRole: PrismaRole): Role {
    return new Role(
      prismaRole.id,
      prismaRole.organizationId,
      prismaRole.roleName,
    );
  }

  static toPersistence(role: Role): PrismaRole {
    return {
      id: role.id,
      organizationId: role.organizationId,
      roleName: role.name,
    };
  }
}
