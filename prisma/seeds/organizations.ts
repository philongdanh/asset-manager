import { PrismaClient } from 'generated/prisma/client';

export const seedOrganizations = async (prisma: PrismaClient) => {
  // 1. Create Organization with UUID
  const orgId = '399e5918-3699-443b-9a5c-00d9274a2d4d'; // Fixed UUID for consistency
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
