import {
  AssetItem,
  AssetTemplate,
  Department,
  PrismaClient,
  Tenant,
  User,
} from 'generated/client';

export const seedAssetItems = async (
  prisma: PrismaClient,
  tenants: Tenant[],
  templates: AssetTemplate[],
  users: User[],
  departments: Department[],
): Promise<AssetItem[]> => {
  console.log('Seeding asset items...');
  const assets: AssetItem[] = [];

  for (const tenant of tenants) {
    const tenantUsers = users.filter((u) => u.tenantId === tenant.id);
    const tenantDepts = departments.filter((d) => d.tenantId === tenant.id);
    const tenantTemplates = templates.filter((t) => t.tenantId === tenant.id);

    const itDept = tenantDepts.find((d) => d.name.includes('IT'));
    const adminUser = tenantUsers.find((u) => u.username.includes('admin'));

    for (let i = 0; i < 10; i++) {
      const template = tenantTemplates[i % tenantTemplates.length];
      const dept = i < 5 ? itDept : tenantDepts[i % tenantDepts.length];
      const user = i < 3 ? adminUser : tenantUsers[i % tenantUsers.length];

      if (!template) continue;

      const asset = await prisma.assetItem.upsert({
        where: { id: `asset-${tenant.id}-${i + 1}` },
        update: {},
        create: {
          id: `asset-${tenant.id}-${i + 1}`,
          tenantId: tenant.id,
          templateId: template.id,
          code: `ASSET-${tenant.code}-${String(i + 1).padStart(3, '0')}`,
          serialNumber: template.requireSerial
            ? `SN-${tenant.code}-${i + 1}-${Date.now()}`
            : null,
          purchaseDate: new Date(2023, i % 12, (i % 28) + 1),
          purchasePrice: template.defaultPurchasePrice
            ? template.defaultPurchasePrice
            : 1000,
          originalCost: template.defaultPurchasePrice
            ? template.defaultPurchasePrice
            : 1000,
          currentValue: template.defaultPurchasePrice
            ? Number(template.defaultPurchasePrice.toString()) * 0.8
            : 800,
          status: i < 8 ? 'IN_USE' : 'IN_GODOWN',
          condition: i < 8 ? 'Good' : 'New',
          location: dept?.name || 'Main Warehouse',
          warrantyStartDate: new Date(2023, i % 12, (i % 28) + 1),
          warrantyEndDate: new Date(2025, i % 12, (i % 28) + 1),
          createdByUserId: adminUser?.id,
          currentDepartmentId: dept?.id,
          currentUserId: user?.id,
        },
      });
      assets.push(asset);
    }
  }
  return assets;
};
