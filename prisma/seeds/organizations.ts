import { PrismaClient } from 'generated/prisma/client';

export const seedOrganizations = async (prisma: PrismaClient) => {
    // 1. Create Organization with UUID
    const orgId = '550e8400-e29b-41d4-a716-446655440000'; // Fixed UUID for consistency
    const org = await prisma.organization.upsert({
        where: { id: orgId },
        update: {},
        create: {
            id: orgId,
            orgName: 'demo',
            status: 'ACTIVE',
            email: 'admin@demo.com',
        },
    });
    console.log(`Created Organization: ${org.orgName}`);
    return org;
};
