import { Module } from '@nestjs/common';
import {
  CreateInventoryCheckHandler,
  FinishInventoryCheckHandler,
  UpdateInventoryCheckDetailsHandler,
  UpdateInventoryCheckHandler,
  DeleteInventoryCheckHandler,
  GetInventoryCheckDetailsHandler,
  GetInventoryCheckHandler,
  GetInventoryChecksHandler,
} from './application';
import {
  INVENTORY_CHECK_REPOSITORY,
  INVENTORY_DETAIL_REPOSITORY,
} from './domain';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { UuidGeneratorService } from 'src/shared/infrastructure/id-generator';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
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
    DeleteInventoryCheckHandler,
    FinishInventoryCheckHandler,
    UpdateInventoryCheckDetailsHandler,
    GetInventoryChecksHandler,
    GetInventoryCheckHandler,
    GetInventoryCheckDetailsHandler,
  ],
  exports: [INVENTORY_CHECK_REPOSITORY, INVENTORY_DETAIL_REPOSITORY],
})
export class InventoryCheckModule {}
