import 'dotenv/config';
import { PrismaClient } from 'generated/prisma/client'; // Adjust path if necessary
import { PrismaPg } from '@prisma/adapter-pg';
import { randomUUID } from 'crypto';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Start Seeding ---');

  // 1. Create Organization with UUID
  const orgId = '550e8400-e29b-41d4-a716-446655440000'; // Fixed UUID for consistency
  const org = await prisma.organization.upsert({
    where: { id: orgId },
    update: {},
    create: {
      id: orgId,
      orgName: 'Hệ thống Quản trị Tài sản G3',
      status: 'ACTIVE',
      email: 'admin@system.com',
    },
  });
  console.log(`Created Organization: ${org.orgName}`);

  // 2. Create System Permissions for all resources
  const resourcePermissions = [
    // Organization permissions
    { name: 'ORGANIZATION_VIEW', description: 'View organization details' },
    { name: 'ORGANIZATION_CREATE', description: 'Create organization' },
    { name: 'ORGANIZATION_UPDATE', description: 'Update organization' },
    { name: 'ORGANIZATION_DELETE', description: 'Delete organization' },

    // Department permissions
    { name: 'DEPARTMENT_VIEW', description: 'View departments' },
    { name: 'DEPARTMENT_CREATE', description: 'Create department' },
    { name: 'DEPARTMENT_UPDATE', description: 'Update department' },
    { name: 'DEPARTMENT_DELETE', description: 'Delete department' },

    // User permissions
    { name: 'USER_VIEW', description: 'View users' },
    { name: 'USER_CREATE', description: 'Create user' },
    { name: 'USER_UPDATE', description: 'Update user' },
    { name: 'USER_DELETE', description: 'Delete user' },

    // Asset Category permissions
    { name: 'ASSET_CATEGORY_VIEW', description: 'View asset categories' },
    { name: 'ASSET_CATEGORY_CREATE', description: 'Create asset category' },
    { name: 'ASSET_CATEGORY_UPDATE', description: 'Update asset category' },
    { name: 'ASSET_CATEGORY_DELETE', description: 'Delete asset category' },

    // Asset permissions
    { name: 'ASSET_VIEW', description: 'View assets' },
    { name: 'ASSET_CREATE', description: 'Create asset' },
    { name: 'ASSET_UPDATE', description: 'Update asset' },
    { name: 'ASSET_DELETE', description: 'Delete asset' },

    // Asset Depreciation permissions
    { name: 'DEPRECIATION_VIEW', description: 'View depreciations' },
    { name: 'DEPRECIATION_CREATE', description: 'Create depreciation' },
    { name: 'DEPRECIATION_UPDATE', description: 'Update depreciation' },
    { name: 'DEPRECIATION_DELETE', description: 'Delete depreciation' },

    // Maintenance Schedule permissions
    { name: 'MAINTENANCE_VIEW', description: 'View maintenance schedules' },
    { name: 'MAINTENANCE_CREATE', description: 'Create maintenance schedule' },
    { name: 'MAINTENANCE_UPDATE', description: 'Update maintenance schedule' },
    { name: 'MAINTENANCE_DELETE', description: 'Delete maintenance schedule' },

    // Asset Transfer permissions
    { name: 'TRANSFER_VIEW', description: 'View asset transfers' },
    { name: 'TRANSFER_CREATE', description: 'Create asset transfer' },
    { name: 'TRANSFER_UPDATE', description: 'Update asset transfer' },
    { name: 'TRANSFER_DELETE', description: 'Delete asset transfer' },
    { name: 'TRANSFER_APPROVE', description: 'Approve asset transfer' },

    // Asset Disposal permissions
    { name: 'DISPOSAL_VIEW', description: 'View asset disposals' },
    { name: 'DISPOSAL_CREATE', description: 'Create asset disposal' },
    { name: 'DISPOSAL_UPDATE', description: 'Update asset disposal' },
    { name: 'DISPOSAL_DELETE', description: 'Delete asset disposal' },
    { name: 'DISPOSAL_APPROVE', description: 'Approve asset disposal' },

    // Asset Document permissions
    { name: 'DOCUMENT_VIEW', description: 'View asset documents' },
    { name: 'DOCUMENT_CREATE', description: 'Create asset document' },
    { name: 'DOCUMENT_UPDATE', description: 'Update asset document' },
    { name: 'DOCUMENT_DELETE', description: 'Delete asset document' },

    // Inventory Check permissions
    { name: 'INVENTORY_VIEW', description: 'View inventory checks' },
    { name: 'INVENTORY_CREATE', description: 'Create inventory check' },
    { name: 'INVENTORY_UPDATE', description: 'Update inventory check' },
    { name: 'INVENTORY_DELETE', description: 'Delete inventory check' },

    // Inventory Detail permissions
    { name: 'INVENTORY_DETAIL_VIEW', description: 'View inventory details' },
    { name: 'INVENTORY_DETAIL_CREATE', description: 'Create inventory detail' },
    { name: 'INVENTORY_DETAIL_UPDATE', description: 'Update inventory detail' },
    { name: 'INVENTORY_DETAIL_DELETE', description: 'Delete inventory detail' },

    // Audit Log permissions
    { name: 'AUDIT_LOG_VIEW', description: 'View audit logs' },

    // Accounting Entry permissions
    { name: 'ACCOUNTING_VIEW', description: 'View accounting entries' },
    { name: 'ACCOUNTING_CREATE', description: 'Create accounting entry' },
    { name: 'ACCOUNTING_UPDATE', description: 'Update accounting entry' },
    { name: 'ACCOUNTING_DELETE', description: 'Delete accounting entry' },

    // Budget Plan permissions
    { name: 'BUDGET_VIEW', description: 'View budget plans' },
    { name: 'BUDGET_CREATE', description: 'Create budget plan' },
    { name: 'BUDGET_UPDATE', description: 'Update budget plan' },
    { name: 'BUDGET_DELETE', description: 'Delete budget plan' },

    // Role permissions
    { name: 'ROLE_VIEW', description: 'View roles' },
    { name: 'ROLE_CREATE', description: 'Create role' },
    { name: 'ROLE_UPDATE', description: 'Update role' },
    { name: 'ROLE_DELETE', description: 'Delete role' },

    // Permission management
    { name: 'PERMISSION_VIEW', description: 'View permissions' },

    // System permissions
    { name: 'SYSTEM_SETTINGS', description: 'Manage system settings' },
    { name: 'REPORT_VIEW', description: 'View all reports' },
    { name: 'DASHBOARD_VIEW', description: 'View dashboard' },
  ];

  const permissions = await Promise.all(
    resourcePermissions.map((p) =>
      prisma.permission.upsert({
        where: { name: p.name },
        update: {},
        create: {
          id: randomUUID(),
          name: p.name,
          description: p.description,
        },
      }),
    ),
  );
  console.log(`Seeded ${permissions.length} permissions.`);

  // 3. Create Admin Role for this Organization
  const adminRoleId = randomUUID();
  const adminRole = await prisma.role.upsert({
    where: {
      organizationId_roleName: {
        organizationId: org.id,
        roleName: 'SUPER_ADMIN',
      },
    },
    update: {},
    create: {
      id: adminRoleId,
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

  // 5. Create Root User with UUID
  const rootUserId = randomUUID();
  const rootUser = await prisma.user.upsert({
    where: { email: 'root@system.local' },
    update: {},
    create: {
      id: rootUserId,
      organizationId: org.id,
      username: 'root_admin',
      password: '123456',
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

  // 7. Create default department
  const defaultDeptId = randomUUID();
  await prisma.department.upsert({
    where: { id: defaultDeptId },
    update: {},
    create: {
      id: defaultDeptId,
      organizationId: org.id,
      name: 'Quản trị hệ thống',
    },
  });
  console.log('Created default department');

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
