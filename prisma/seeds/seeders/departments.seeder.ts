import { Department, PrismaClient, Tenant } from 'generated/client';
import { DEPARTMENTS } from '../data';

export const seedDepartments = async (
  prisma: PrismaClient,
  tenants: Tenant[],
): Promise<Department[]> => {
  console.log('Seeding departments...');
  const departments: Department[] = [];

  for (const tenant of tenants) {
    const codeToIdMap = new Map<string, string>();

    for (const deptData of DEPARTMENTS) {
      let parentId: string | null = null;
      if (deptData.parentCode) {
        parentId = codeToIdMap.get(deptData.parentCode) || null;
      }

      // Ensure unique ID based on code
      const id = `dept-${tenant.id}-${deptData.code}`;

      const department = await prisma.department.upsert({
        where: { id },
        update: {
          name: deptData.name,
          parentId,
        },
        create: {
          id,
          tenantId: tenant.id,
          name: deptData.name,
          parentId,
        },
      });

      departments.push(department);
      codeToIdMap.set(deptData.code, department.id);
    }
  }
  return departments;
};
