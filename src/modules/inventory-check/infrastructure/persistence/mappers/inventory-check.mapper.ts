import {
  Prisma,
  InventoryCheck as PrismaInventoryCheck,
} from 'generated/prisma/client';
import { InventoryCheck } from 'src/modules/inventory-check/domain';

export class InventoryCheckMapper {
  static toDomain(raw: PrismaInventoryCheck): InventoryCheck {
    const builder = InventoryCheck.builder(
      raw.id,
      raw.organizationId,
      raw.createdByUserId,
    );

    builder.checkDate = raw.inventoryDate;
    builder.status = raw.status;
    builder.inventoryName = raw.inventoryName;
    if (raw.notes) builder.notes = raw.notes;

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
        inventoryName: inventoryCheck.inventoryName,
        notes: inventoryCheck.notes,
        createdAt: inventoryCheck.createdAt,
        updatedAt: inventoryCheck.updatedAt,
      },
    };
  }
}
