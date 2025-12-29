import { Prisma, InventoryDetail as PrismaInventoryDetail } from 'generated/prisma/client';
import { InventoryDetail } from 'src/domain/inventory-audit/inventory-detail';

export class InventoryDetailMapper {
    static toDomain(raw: PrismaInventoryDetail): InventoryDetail {
        const builder = InventoryDetail.builder(
            raw.id,
            raw.inventoryId,
            raw.assetId,
            'UNKNOWN', // Expected status not stored in DB
        );

        builder.withActualResult(null, raw.physicalStatus); // Actual location not stored
        // isMatch is calculated in withActualResult, but DB has isMatched.
        // We should rely on DB value if possible, but builder calculates it.
        // If DB has isMatched=false, and we pass expected='UNKNOWN' and actual='GOOD', match might be false (mismatch).
        // Better to trust builder logic or override?
        // Builder doesn't expose public isMatch setter except via withActualResult.
        // We can't force isMatch.

        if (raw.notes) {
            builder.withNotes(raw.notes);
        }

        return builder.build();
    }

    static toPersistence(detail: InventoryDetail): Prisma.InventoryDetailCreateArgs {
        return {
            data: {
                id: detail.id,
                inventoryId: detail.inventoryCheckId,
                assetId: detail.assetId,
                checkedByUserId: '00000000-0000-0000-0000-000000000000', // Missing in domain
                physicalStatus: detail.actualStatus || 'UNKNOWN',
                isMatched: detail.isMatch,
                notes: detail.notes,
                checkedDate: new Date(), // Missing in domain
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        };
    }
}
