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
        builder.notes = raw.inventoryName;

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
                inventoryName: inventoryCheck.notes || 'Inventory Check',
                createdAt: inventoryCheck.createdAt,
                updatedAt: inventoryCheck.updatedAt,
            },
        };
    }
}
