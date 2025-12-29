import { Module } from '@nestjs/common';
import {
  CreateAssetHandler,
  DeleteAssetHandler,
  UpdateAssetHandler,
} from 'src/application/commands/handlers';
import {
  GetAssetDetailsHandler,
  GetAssetsHandler,
} from 'src/application/queries/handlers';
import { ASSET_REPOSITORY } from 'src/domain/asset-lifecycle/asset';
import { ID_GENERATOR } from 'src/domain/core/interfaces';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import { PrismaAssetRepository } from 'src/infrastructure/persistence/prisma/repositories';
import { AssetController } from './asset.controller';

@Module({
  controllers: [AssetController],
  providers: [
    PrismaService,
    {
      provide: ID_GENERATOR,
      useClass: UuidGeneratorService,
    },
    {
      provide: ASSET_REPOSITORY,
      useClass: PrismaAssetRepository,
    },
    CreateAssetHandler,
    UpdateAssetHandler,
    DeleteAssetHandler,
    GetAssetsHandler,
    GetAssetDetailsHandler,
  ],
})
export class AssetModule { }
