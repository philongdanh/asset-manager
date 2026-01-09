import {
  AssetCategory,
  InventoryItem,
  PrismaClient,
  Tenant,
} from 'generated/client';
import { INVENTORY_ITEMS } from '../data';

export const seedInventoryItems = async (
  prisma: PrismaClient,
  tenants: Tenant[],
  categories: AssetCategory[],
): Promise<InventoryItem[]> => {
  console.log('Seeding inventory items...');
  const inventoryItems: InventoryItem[] = [];

  for (const tenant of tenants) {
    const tenantCategories = categories.filter((c) => c.tenantId === tenant.id);

    for (let i = 0; i < INVENTORY_ITEMS.length; i++) {
      const itemData = INVENTORY_ITEMS[i];
      const category = tenantCategories.find(
        (c) => c.code === itemData.categoryCode,
      );

      const item = await prisma.inventoryItem.upsert({
        where: { id: `inv-${tenant.id}-${i + 1}` },
        update: {},
        create: {
          id: `inv-${tenant.id}-${i + 1}`,
          tenantId: tenant.id,
          sku: itemData.sku,
          name: itemData.name,
          unit: itemData.unit,
          currentStock: itemData.currentStock,
          unitCost: itemData.unitCost, // Prisma Decimal handling might need conversion if strict, but let's assume number -> Decimal works for seeding
          totalValue: itemData.currentStock * itemData.unitCost,
          categoryId: category?.id,
          storageLocation: itemData.storageLocation,
        },
      });
      inventoryItems.push(item);
    }
  }
  return inventoryItems;
};
