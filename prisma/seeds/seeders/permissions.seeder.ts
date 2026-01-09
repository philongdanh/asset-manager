import { Permission, PrismaClient } from 'generated/client';
import { PERMISSIONS } from '../data';

export const seedPermissions = async (
  prisma: PrismaClient,
): Promise<Permission[]> => {
  console.log('Seeding permissions...');
  const result: Permission[] = [];
  for (const permission of PERMISSIONS) {
    const p = await prisma.permission.upsert({
      where: { id: permission.id },
      update: {},
      create: permission,
    });
    result.push(p);
  }
  return result;
};
