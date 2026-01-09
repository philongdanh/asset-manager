import { AssetCategory, PrismaClient, Tenant } from 'generated/client';
import { ASSET_CATEGORIES } from '../data';

export const seedAssetCategories = async (
  prisma: PrismaClient,
  tenants: Tenant[],
): Promise<AssetCategory[]> => {
  console.log('Seeding asset categories...');
  const categories: AssetCategory[] = [];

  for (const tenant of tenants) {
    for (let i = 0; i < ASSET_CATEGORIES.length; i++) {
      const catData = ASSET_CATEGORIES[i];
      const category = await prisma.assetCategory.upsert({
        where: { id: `category-${tenant.id}-${i + 1}` },
        update: {},
        create: {
          id: `category-${tenant.id}-${i + 1}`,
          tenantId: tenant.id,
          code: catData.code,
          name: catData.name,
        },
      });
      categories.push(category);
    }
  }
  return categories;
};
