import { Module } from '@nestjs/common';
import {
    CreateInventoryCheckHandler,
    FinishInventoryCheckHandler,
    UpdateInventoryCheckDetailsHandler,
    UpdateInventoryCheckHandler,
} from 'src/application/commands/handlers';
import {
    GetInventoryCheckDetailsHandler,
    GetInventoryCheckHandler,
    GetInventoryChecksHandler,
} from 'src/application/queries/handlers';
import { INVENTORY_CHECK_REPOSITORY } from 'src/domain/inventory-audit/inventory-check';
import { INVENTORY_DETAIL_REPOSITORY } from 'src/domain/inventory-audit/inventory-detail';
import { ID_GENERATOR } from 'src/domain/core/interfaces';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import {
    PrismaInventoryCheckRepository,
    PrismaInventoryDetailRepository,
} from 'src/infrastructure/persistence/prisma/repositories';
import { InventoryCheckController } from './inventory-check.controller';

@Module({
    controllers: [InventoryCheckController],
    providers: [
        PrismaService,
        {
            provide: ID_GENERATOR,
            useClass: UuidGeneratorService,
        },
        {
            provide: INVENTORY_CHECK_REPOSITORY,
            useClass: PrismaInventoryCheckRepository,
        },
        {
            provide: INVENTORY_DETAIL_REPOSITORY,
            useClass: PrismaInventoryDetailRepository,
        },
        CreateInventoryCheckHandler,
        UpdateInventoryCheckHandler,
        FinishInventoryCheckHandler,
        UpdateInventoryCheckDetailsHandler,
        GetInventoryChecksHandler,
        GetInventoryCheckHandler,
        GetInventoryCheckDetailsHandler,
    ],
})
export class InventoryCheckModule { }
