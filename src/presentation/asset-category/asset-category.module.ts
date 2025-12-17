import { Module } from '@nestjs/common';
import { UuidGeneratorService } from 'src/infrastructure/id-generator';
import { PrismaService } from 'src/infrastructure/prisma';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { AssetCategoryController } from './asset-category.controller';
import { CreateAssetCategoryUseCase } from 'src/application/asset-category';
import { PrismaAssetCategoryRepository } from 'src/infrastructure/asset-category/prisma-asset-category.repository';
import { ASSET_CATEGORY_REPOSITORY } from 'src/domain/asset-category';
import { ORGANIZATION_REPOSITORY } from 'src/domain/organization';
import { PrismaOrgRepository } from 'src/infrastructure/organization';

@Module({
  controllers: [AssetCategoryController],
  providers: [
    CreateAssetCategoryUseCase,
    {
      provide: ASSET_CATEGORY_REPOSITORY,
      useClass: PrismaAssetCategoryRepository,
    },
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: PrismaOrgRepository,
    },
    {
      provide: ID_GENERATOR,
      useClass: UuidGeneratorService,
    },
    PrismaService,
  ],
})
export class AssetCategoryModule {}
