import { Module } from '@nestjs/common';
import { CreateAssetHandler } from './application/commands/create-asset/create-asset.handler';
import { DeleteAssetHandler } from './application/commands/delete-asset/delete-asset.handler';
import { UpdateAssetHandler } from './application/commands/update-asset/update-asset.handler';
import { GetAssetDetailsHandler } from './application/queries/get-asset-details/get-asset-details.handler';
import { GetAssetsHandler } from './application/queries/get-assets/get-assets.handler';
import { ASSET_REPOSITORY } from './domain/repositories/asset.repository.interface';
import { ID_GENERATOR } from 'src/domain/core/interfaces';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import { PrismaAssetRepository } from './infrastructure/persistence/repositories/prisma-asset.repository';
import { AssetController } from './presentation';

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
export class AssetModule {}
