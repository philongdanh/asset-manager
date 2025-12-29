import {
  Prisma,
  InventoryCheck as PrismaInventoryCheck,
} from 'generated/prisma/client';
import { InventoryCheck } from 'src/domain/inventory-audit/inventory-check';

export class InventoryCheckMapper {
  static toDomain(raw: PrismaInventoryCheck): InventoryCheck {
    const builder = InventoryCheck.builder(
      raw.id,
      raw.organizationId,
      raw.createdByUserId,
    );

    builder.checkDate = raw.inventoryDate;
    builder.status = raw.status;
    builder.notes = raw.inventoryName; // Mapping inventoryName to notes

    return builder.build();
  }

  static toPersistence(
    inventoryCheck: InventoryCheck,
  ): Prisma.InventoryCheckCreateArgs {
    return {
      data: {
        id: inventoryCheck.id,
        organizationId: inventoryCheck.organizationId,
        inventoryDate: inventoryCheck.checkDate,
        createdByUserId: inventoryCheck.checkerUserId,
        status: inventoryCheck.status,
        inventoryName: inventoryCheck.notes || 'Inventory Check', // Default if notes null
        createdAt: new Date(), // Prisma handles defaults but good to be explicit or let DB handle
        updatedAt: new Date(),
        // Note: createdAt/updatedAt might be overwritten by DB default
      },
    };
  }
}
