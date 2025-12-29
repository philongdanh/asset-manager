import {
    Prisma,
    Role as PrismaRole,
    RolePermission as PrismaRolePermission,
    Permission as PrismaPermission,
} from 'generated/prisma/client';
import { Role } from '../../../domain';

export class RoleMapper {
    static toDomain(
        prismaRole: PrismaRole & {
            rolePermissions?: (PrismaRolePermission & {
                permission?: PrismaPermission;
            })[];
        },
    ): Role {
        return Role.builder(
            prismaRole.id,
            prismaRole.organizationId,
            prismaRole.roleName,
        )
            .withTimestamps(prismaRole.createdAt, prismaRole.updatedAt)
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
