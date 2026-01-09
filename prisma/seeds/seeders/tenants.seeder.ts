import { PrismaClient, Tenant, TenantStatus } from 'generated/client';
import { TENANTS } from '../data';

export const seedTenants = async (prisma: PrismaClient): Promise<Tenant[]> => {
  console.log('Seeding tenants...');
  const result: Tenant[] = [];
  for (const tenant of TENANTS) {
    const t = await prisma.tenant.upsert({
      where: { id: tenant.id },
      update: {},
      create: {
        ...tenant,
        status: tenant.status as TenantStatus,
      },
    });
    result.push(t);
  }
  return result;
};
