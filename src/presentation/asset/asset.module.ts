import { Module } from '@nestjs/common';
import { AssetController } from './asset.controller';
import { CreateAssetUseCase } from 'src/application/asset/create-asset.use-case';
import { ASSET_REPOSITORY } from 'src/domain/asset/asset.repository.interface';
import { PrismaAssetRepository } from 'src/infrastructure/asset/prisma-asset.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { UuidGeneratorService } from 'src/infrastructure/id-generator/uuid-generator.service';
import { ID_GENERATOR } from 'src/shared/domain/interfaces/id-generator.interface';

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
