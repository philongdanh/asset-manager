import { Department, PrismaClient, Tenant } from 'generated/client';
import { DEPARTMENTS, IT_SUB_DEPARTMENTS } from '../data';

export const seedDepartments = async (
  prisma: PrismaClient,
  tenants: Tenant[],
): Promise<Department[]> => {
  console.log('Seeding departments...');
  const departments: Department[] = [];

  for (const tenant of tenants) {
    // Main departments
    for (let i = 0; i < DEPARTMENTS.length; i++) {
      const deptData = DEPARTMENTS[i];
      const department = await prisma.department.upsert({
        where: { id: `dept-${tenant.id}-${i + 1}` },
        update: {},
        create: {
          id: `dept-${tenant.id}-${i + 1}`,
          tenantId: tenant.id,
          name: deptData.name,
          parentId: deptData.parentId,
        },
      });
      departments.push(department);
    }

    // Sub-departments under IT
    const itDept = departments.find(
      (d) => d.tenantId === tenant.id && d.name === 'IT Dept',
    );

    if (itDept) {
      for (let i = 0; i < IT_SUB_DEPARTMENTS.length; i++) {
        const subDept = await prisma.department.upsert({
          where: { id: `dept-${tenant.id}-it-${i + 1}` },
          update: {},
          create: {
            id: `dept-${tenant.id}-it-${i + 1}`,
            tenantId: tenant.id,
            name: IT_SUB_DEPARTMENTS[i],
            parentId: itDept.id,
          },
        });
        departments.push(subDept);
      }
    }
  }
  return departments;
};
