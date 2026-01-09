import {
  AssetCategory,
  AssetTemplate,
  PrismaClient,
  Tenant,
} from 'generated/client';
import { ASSET_TEMPLATES_DATA } from '../data';

export const seedAssetTemplates = async (
  prisma: PrismaClient,
  tenants: Tenant[],
  categories: AssetCategory[],
): Promise<AssetTemplate[]> => {
  console.log('Seeding asset templates...');
  const templates: AssetTemplate[] = [];

  for (const tenant of tenants) {
    const tenantCategories = categories.filter((c) => c.tenantId === tenant.id);

    for (let i = 0; i < ASSET_TEMPLATES_DATA.length; i++) {
      const tplData = ASSET_TEMPLATES_DATA[i];
      const category = tenantCategories.find(
        (c) => c.code === tplData.categoryCode,
      );

      const template = await prisma.assetTemplate.upsert({
        where: { id: `template-${tenant.id}-${i + 1}` },
        update: {},
        create: {
          id: `template-${tenant.id}-${i + 1}`,
          tenantId: tenant.id,
          code: tplData.code,
          name: tplData.name,
          model: tplData.model,
          manufacturer: tplData.manufacturer,
          categoryId: category?.id || '',
          defaultPurchasePrice: tplData.defaultPurchasePrice,
          requireSerial: tplData.requireSerial,
          canDepreciate: tplData.canDepreciate,
        },
      });
      templates.push(template);
    }
  }
  return templates;
};
