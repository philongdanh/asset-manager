import {
  Prisma,
  InventoryDetail as PrismaInventoryDetail,
} from 'generated/prisma/client';
import { InventoryDetail } from 'src/modules/inventory-check/domain';

export class InventoryDetailMapper {
  static toDomain(raw: PrismaInventoryDetail): InventoryDetail {
    const builder = InventoryDetail.builder(
      raw.id,
      raw.inventoryId,
      raw.assetId,
      'UNKNOWN',
    );

    builder.withActualResult(null, raw.physicalStatus);

    if (raw.notes) {
      builder.withNotes(raw.notes);
    }

    return builder.build();
  }

  static toPersistence(
    detail: InventoryDetail,
  ): Prisma.InventoryDetailCreateArgs {
    return {
      data: {
        id: detail.id,
        inventoryId: detail.inventoryCheckId,
        assetId: detail.assetId,
        checkedByUserId: '00000000-0000-0000-0000-000000000000',
        physicalStatus: detail.actualStatus || 'UNKNOWN',
        isMatched: detail.isMatch,
        notes: detail.notes,
        checkedDate: new Date(),
        createdAt: detail.createdAt,
        updatedAt: detail.updatedAt,
      },
    };
  }
}
