import { PrismaClient } from 'generated/prisma/client';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

// Fixed UUIDs for demo users to ensure consistency after re-seeding
const FIXED_ROOT_USER_ID = '00000000-0000-0000-0000-000000000001';
const FIXED_DEMO_ADMIN_ID = '00000000-0000-0000-0000-000000000002';

export const seedUsers = async (
    prisma: PrismaClient,
    orgId: string,
    adminRoleId: string,
) => {
    const hashedPassword = await bcrypt.hash('123456', await bcrypt.genSalt(10));

    // 5. Create Root User (No Organization)
    const rootUser = await prisma.user.upsert({
        where: { email: 'root@system.local' },
        update: {
            isRoot: true,
            organizationId: null,
            password: hashedPassword, // Ensure password is also reset if needed
        },
        create: {
            id: FIXED_ROOT_USER_ID,
            organizationId: null, // Root admin has no organization
            username: 'root_admin',
            password: hashedPassword,
            email: 'root@system.local',
            status: 'ACTIVE',
            isRoot: true,
        },
    });
    console.log(`Created Root User: ${rootUser.username} (No Org)`);

    // 6. Create Demo Admin User (For Demo Organization)
    const demoAdminUser = await prisma.user.upsert({
        where: { email: 'admin@demo.local' },
        update: {},
        create: {
            id: FIXED_DEMO_ADMIN_ID,
            organizationId: orgId,
            username: 'demo_admin',
            password: hashedPassword,
            email: 'admin@demo.local',
            status: 'ACTIVE',
        },
    });
    console.log(`Created Demo Admin User: ${demoAdminUser.username}`);

    // 7. Assign Admin Role to Demo Admin User
    await prisma.userRole.upsert({
        where: {
            userId_roleId: {
                userId: demoAdminUser.id,
                roleId: adminRoleId,
            },
        },
        update: {},
        create: {
            userId: demoAdminUser.id,
            roleId: adminRoleId,
        },
    });
};
