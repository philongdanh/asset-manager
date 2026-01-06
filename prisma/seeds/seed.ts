import 'dotenv/config';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { seedOrganizations } from './organizations';
import { seedPermissions } from './permissions';
import { seedRoles } from './roles';
import { seedUsers } from './users';
import { seedDepartments } from './departments';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Start Seeding ---');

  // 1. Create Organization
  const org = await seedOrganizations(prisma);

  // 2. Create Permissions
  const permissions = await seedPermissions(prisma);

  // 3. Create Key Roles (and link permissions)
  const adminRole = await seedRoles(prisma, org.id, permissions);

  // 4. Create Users (Root & Store Admin)
  await seedUsers(prisma, org.id, adminRole.id);

  // 5. Create Departments
  await seedDepartments(prisma, org.id);

  console.log('--- Seeding Completed Successfully ---');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
