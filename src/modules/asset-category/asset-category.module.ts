import { Module, Provider } from '@nestjs/common';
import { ASSET_CATEGORY_REPOSITORY } from './domain';
import { PrismaAssetCategoryRepository } from './infrastructure';
import {
  CreateAssetCategoryHandler,
  UpdateAssetCategoryHandler,
  DeleteAssetCategoryHandler,
  GetAssetCategoriesHandler,
  GetAssetCategoryDetailsHandler,
} from './application';
import { AssetCategoryController } from './presentation';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';

import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { UuidGeneratorService } from 'src/shared/infrastructure/id-generator';

const handlers: Provider[] = [
  CreateAssetCategoryHandler,
  UpdateAssetCategoryHandler,
  DeleteAssetCategoryHandler,
  GetAssetCategoriesHandler,
  GetAssetCategoryDetailsHandler,
];

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
    ...handlers,
  ],
  exports: [ASSET_CATEGORY_REPOSITORY],
})
export class AssetCategoryModule {}
