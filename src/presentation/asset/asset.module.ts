import { Module } from '@nestjs/common';
import { CreateAssetUseCase } from 'src/application/asset';
import { ASSET_REPOSITORY } from 'src/domain/asset';
import { PrismaAssetRepository } from 'src/infrastructure/asset/prisma-asset.repository';
import { UuidGeneratorService } from 'src/infrastructure/id-generator';
import { PrismaService } from 'src/infrastructure/prisma';
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
