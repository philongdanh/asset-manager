import { AssetCategory, PrismaClient, Tenant } from 'generated/client';
import { ASSET_CATEGORIES } from '../data';

export const seedAssetCategories = async (
  prisma: PrismaClient,
  tenants: Tenant[],
): Promise<AssetCategory[]> => {
  console.log('Seeding asset categories...');
  const categories: AssetCategory[] = [];

  for (const tenant of tenants) {
    const codeToIdMap = new Map<string, string>();

    for (const catData of ASSET_CATEGORIES) {
      let parentId: string | null = null;
      if (catData.parentCode) {
        parentId = codeToIdMap.get(catData.parentCode) || null;
      }

      const id = `category-${tenant.id}-${catData.code}`;

      const category = await prisma.assetCategory.upsert({
        where: { id },
        update: {
          name: catData.name,
          code: catData.code,
          parentId,
        },
        create: {
          id,
          tenantId: tenant.id,
          code: catData.code,
          name: catData.name,
          parentId,
        },
      });
      categories.push(category);
      codeToIdMap.set(catData.code, category.id);
    }
  }
  return categories;
};
