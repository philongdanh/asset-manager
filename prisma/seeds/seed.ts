import 'dotenv/config';
import { PrismaClient } from 'generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { seedAssetCategories } from './seeders/asset-categories.seeder';
import { seedAssetItems } from './seeders/asset-items.seeder';
import { seedAssetTemplates } from './seeders/asset-templates.seeder';
import { seedBudgetPlans } from './seeders/budget-plans.seeder';
import { seedDepartments } from './seeders/departments.seeder';
import { seedInventoryItems } from './seeders/inventory-items.seeder';
import { seedPermissions } from './seeders/permissions.seeder';
import { seedRoles } from './seeders/roles.seeder';
import { seedTenants } from './seeders/tenants.seeder';
import { seedUsers } from './seeders/users.seeder';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  console.log('--- Start Seeding ---');

  // Clear existing data (careful in production!)
  console.log('Clearing existing data...');
  // Clear existing data (careful in production!)
  console.log('Clearing existing data...');

  await prisma.inventoryDetail.deleteMany({});
  await prisma.inventoryCheck.deleteMany({});
  await prisma.inventoryTransaction.deleteMany({});
  await prisma.inventoryBatchTransaction.deleteMany({});
  await prisma.inventoryBatch.deleteMany({});
  await prisma.inventoryTransferItem.deleteMany({});
  await prisma.inventoryTransfer.deleteMany({});
  await prisma.assetDocument.deleteMany({});
  await prisma.assetDisposal.deleteMany({});
  await prisma.assetTransfer.deleteMany({});
  await prisma.maintenanceSchedule.deleteMany({});
  await prisma.assetDepreciation.deleteMany({});
  await prisma.accountingEntry.deleteMany({});
  await prisma.budgetPlan.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.assetItem.deleteMany({});
  await prisma.inventoryItem.deleteMany({});
  await prisma.assetTemplate.deleteMany({});
  await prisma.assetCategory.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.userRole.deleteMany({});
  await prisma.rolePermission.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.tenant.deleteMany({});

  console.log('Cleared all data');

  // 1. Create Tenants
  const tenants = await seedTenants(prisma);

  // 2. Create Permissions (global)
  const permissions = await seedPermissions(prisma);

  // 3. Create Roles for each tenant
  const roles = await seedRoles(prisma, tenants, permissions);

  // 4. Create Users
  const users = await seedUsers(prisma, tenants, roles);

  // 5. Create Departments
  const departments = await seedDepartments(prisma, tenants);

  // 6. Create Asset Categories
  const categories = await seedAssetCategories(prisma, tenants);

  // 7. Create Asset Templates
  const templates = await seedAssetTemplates(prisma, tenants, categories);

  // 8. Create Asset Items
  const assets = await seedAssetItems(
    prisma,
    tenants,
    templates,
    users,
    departments,
  );

  // 9. Create Inventory Items
  const inventoryItems = await seedInventoryItems(prisma, tenants, categories);

  // 10. Create Budget Plans
  const budgetPlans = await seedBudgetPlans(prisma, tenants, departments);

  console.log('--- Seeding Completed Successfully ---');
  console.log(`Created: ${tenants.length} tenants`);
  console.log(`Created: ${permissions.length} permissions`);
  console.log(`Created: ${roles.length} roles`);
  console.log(`Created: ${users.length} users`);
  console.log(`Created: ${departments.length} departments`);
  console.log(`Created: ${categories.length} categories`);
  console.log(`Created: ${templates.length} templates`);
  console.log(`Created: ${assets.length} asset items`);
  console.log(`Created: ${inventoryItems.length} inventory items`);
  console.log(`Created: ${budgetPlans.length} budget plans`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seeding error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
