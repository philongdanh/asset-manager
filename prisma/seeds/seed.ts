import 'dotenv/config';
import { PrismaClient } from 'generated/prisma/client'; // Adjust path if necessary
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Start Seeding ---');

  // 1. Create Organization
  const org = await prisma.organization.upsert({
    where: { id: 'org-root-id' }, // Fixed ID for consistency
    update: {},
    create: {
      id: 'org-root-id',
      orgName: 'Hệ thống Quản trị Tài sản G3',
      status: 'ACTIVE',
      email: 'admin@system.com',
    },
  });
  console.log(`Created Organization: ${org.orgName}`);

  // 2. Create System Permissions
  const permissionNames = [
    'USER_VIEW',
    'USER_CREATE',
    'USER_UPDATE',
    'USER_DELETE',
    'ASSET_VIEW',
    'ASSET_CREATE',
    'ASSET_UPDATE',
    'ASSET_DELETE',
    'REPORT_VIEW',
    'SYSTEM_SETTINGS',
  ];

  const permissions = await Promise.all(
    permissionNames.map((p) =>
      prisma.permission.upsert({
        where: { name: p },
        update: {},
        create: {
          name: p,
          description: `Permission to ${p.toLowerCase().replace('_', ' ')}`,
        },
      }),
    ),
  );
  console.log(`Seeded ${permissions.length} permissions.`);

  // 3. Create Admin Role for this Organization
  const adminRole = await prisma.role.upsert({
    where: {
      organizationId_roleName: {
        organizationId: org.id,
        roleName: 'SUPER_ADMIN',
      },
    },
    update: {},
    create: {
      organizationId: org.id,
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

  // 5. Create Root User
  const rootUser = await prisma.user.upsert({
    where: { email: 'root@system.local' },
    update: {},
    create: {
      organizationId: org.id,
      username: 'root_admin',
      email: 'root@system.local',
      status: 'ACTIVE',
    },
  });
  console.log(`Created Root User: ${rootUser.username}`);

  // 6. Assign Admin Role to Root User
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: rootUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: rootUser.id,
      roleId: adminRole.id,
    },
  });

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
