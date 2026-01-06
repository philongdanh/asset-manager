import { PrismaClient } from 'generated/prisma/client';
import { randomUUID } from 'crypto';

export const seedRoles = async (
    prisma: PrismaClient,
    orgId: string,
    permissions: { id: string }[],
) => {
    // 3. Create Admin Role for this Organization
    const adminRoleId = randomUUID();
    const adminRole = await prisma.role.upsert({
        where: {
            organizationId_roleName: {
                organizationId: orgId,
                roleName: 'SUPER_ADMIN',
            },
        },
        update: {},
        create: {
            id: adminRoleId,
            organizationId: orgId,
            roleName: 'SUPER_ADMIN',
        },
    });
    console.log(`Created Role: ${adminRole.roleName}`);

    // 4. Link all permissions to Admin Role
    await Promise.all(
        permissions.map((p) =>
            prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: adminRole.id,
                        permissionId: p.id,
                    },
                },
                update: {},
                create: {
                    roleId: adminRole.id,
                    permissionId: p.id,
                },
            }),
        ),
    );

    return adminRole;
};
