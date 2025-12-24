import { Module } from '@nestjs/common';
import { CreateAssetUseCase } from 'src/application/asset-management/asset';
import { ASSET_REPOSITORY } from 'src/domain/asset-lifecycle/asset';
import { PrismaAssetRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma-asset.repository';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { AssetController } from './asset.controller';

@Module({
  controllers: [AssetController],
  providers: [
    CreateAssetUseCase,
    {
      provide: ASSET_REPOSITORY,
      useClass: PrismaAssetRepository,
    },
    {
      provide: ID_GENERATOR,
      useClass: UuidGeneratorService,
    },
    PrismaService,
  ],
})
export class AssetModule {}
