import { Module } from '@nestjs/common';
import {
  CreateAssetCategoryHandler,
  DeleteAssetCategoryHandler,
  UpdateAssetCategoryHandler,
} from 'src/application/commands/handlers';
import {
  GetAssetCategoriesHandler,
  GetAssetCategoryDetailsHandler,
} from 'src/application/queries/handlers';
import { ASSET_CATEGORY_REPOSITORY } from 'src/domain/asset-lifecycle/asset-category';
import { ID_GENERATOR } from 'src/domain/core/interfaces';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import { PrismaAssetCategoryRepository } from 'src/infrastructure/persistence/prisma/repositories';
import { AssetCategoryController } from './asset-category.controller';

@Module({
  controllers: [AssetCategoryController],
  providers: [
    PrismaService,
    {
      provide: ID_GENERATOR,
      useClass: UuidGeneratorService,
    },
    {
      provide: ASSET_CATEGORY_REPOSITORY,
      useClass: PrismaAssetCategoryRepository,
    },
    CreateAssetCategoryHandler,
    UpdateAssetCategoryHandler,
    DeleteAssetCategoryHandler,
    GetAssetCategoriesHandler,
    GetAssetCategoryDetailsHandler,
  ],
})
export class AssetCategoryModule { }
