import { Module } from '@nestjs/common';
import {
    CreateInventoryCheckHandler,
    FinishInventoryCheckHandler,
    UpdateInventoryCheckDetailsHandler,
    UpdateInventoryCheckHandler,
    GetInventoryCheckDetailsHandler,
    GetInventoryCheckHandler,
    GetInventoryChecksHandler,
} from './application';
import {
    INVENTORY_CHECK_REPOSITORY,
    INVENTORY_DETAIL_REPOSITORY,
} from './domain';
import { ID_GENERATOR } from 'src/domain/core/interfaces';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import {
    PrismaInventoryCheckRepository,
    PrismaInventoryDetailRepository,
} from './infrastructure';
import { InventoryCheckController } from './presentation';

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
    exports: [INVENTORY_CHECK_REPOSITORY, INVENTORY_DETAIL_REPOSITORY],
})
export class InventoryCheckModule { }
