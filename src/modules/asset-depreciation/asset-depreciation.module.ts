import { Module, Provider } from '@nestjs/common';
import { ASSET_DEPRECIATION_REPOSITORY } from './domain';
import { PrismaAssetDepreciationRepository } from './infrastructure';
import {
  RecordDepreciationHandler,
  GetAssetDepreciationsHandler,
  GetAssetDepreciationDetailsHandler,
} from './application';
import { AssetDepreciationController } from './presentation';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { UuidGeneratorService } from 'src/shared/infrastructure/id-generator';
import { ASSET_REPOSITORY } from '../asset/domain';
import { PrismaAssetRepository } from '../asset/infrastructure/persistence/repositories/prisma-asset.repository';
import { ORGANIZATION_REPOSITORY } from '../organization/domain';
import { PrismaOrganizationRepository } from '../organization/infrastructure/persistence/repositories/prisma-organization.repository';

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
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: PrismaOrganizationRepository,
    },
    ...handlers,
  ],
  exports: [ASSET_DEPRECIATION_REPOSITORY],
})
export class AssetDepreciationModule {}
