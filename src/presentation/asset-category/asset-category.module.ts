import { Module } from '@nestjs/common';
import { AssetCategoryController } from './asset-category.controller';

@Module({
  controllers: [AssetCategoryController],
})
export class AssetCategoryModule {}
