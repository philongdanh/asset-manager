import { Module, Provider } from '@nestjs/common';
import { ASSET_DEPRECIATION_REPOSITORY } from './domain';
import { PrismaAssetDepreciationRepository } from './infrastructure';
import {
  RecordDepreciationHandler,
  GetAssetDepreciationsHandler,
  GetAssetDepreciationDetailsHandler,
} from './application';
import { AssetDepreciationController } from './presentation';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { ID_GENERATOR } from 'src/domain/core/interfaces';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { ASSET_REPOSITORY } from '../asset/domain';
import { PrismaAssetRepository } from '../asset/infrastructure/persistence/repositories/prisma-asset.repository';

const handlers: Provider[] = [
  RecordDepreciationHandler,
  GetAssetDepreciationsHandler,
  GetAssetDepreciationDetailsHandler,
];

@Module({
  controllers: [AssetDepreciationController],
  providers: [
    PrismaService,
    {
      provide: ID_GENERATOR,
      useClass: UuidGeneratorService,
    },
    {
      provide: ASSET_DEPRECIATION_REPOSITORY,
      useClass: PrismaAssetDepreciationRepository,
    },
    {
      provide: ASSET_REPOSITORY,
      useClass: PrismaAssetRepository,
    },
    ...handlers,
  ],
  exports: [ASSET_DEPRECIATION_REPOSITORY],
})
export class AssetDepreciationModule {}
