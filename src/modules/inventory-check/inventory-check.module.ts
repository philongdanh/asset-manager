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
import {
  ORGANIZATION_REPOSITORY,
  PrismaOrganizationRepository,
} from '../organization';
import { USER_REPOSITORY, PrismaUserRepository } from '../user';

import { AssetModule } from '../asset/asset.module';

@Module({
  imports: [AssetModule],
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
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: PrismaOrganizationRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
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
export class InventoryCheckModule { }
