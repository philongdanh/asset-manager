import {
  Prisma,
  InventoryCheck as PrismaInventoryCheck,
} from 'generated/prisma/client';
import { InventoryCheck } from 'src/modules/inventory-check/domain';

import { InventoryDetailMapper } from './inventory-detail.mapper';

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

    // Map details if included
    if ((raw as any).details && Array.isArray((raw as any).details)) {
      const details = (raw as any).details.map(InventoryDetailMapper.toDomain);
      builder.withDetails(details);
    }

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
        details: {
          create: inventoryCheck.details.map((detail) => ({
            id: detail.id,
            assetId: detail.assetId,
            checkedByUserId: inventoryCheck.checkerUserId,
            physicalStatus: detail.actualStatus || 'UNKNOWN',
            isMatched: detail.isMatch,
            notes: detail.notes,
            checkedDate: new Date(),
            createdAt: detail.createdAt,
            updatedAt: detail.updatedAt,
          })),
        },
      },
    };
  }
}
