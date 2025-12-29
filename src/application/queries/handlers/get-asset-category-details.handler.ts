import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
    ASSET_CATEGORY_REPOSITORY,
    type IAssetCategoryRepository,
    AssetCategory,
} from 'src/domain/asset-lifecycle/asset-category';
import { GetAssetCategoryDetailsQuery } from '../get-asset-category-details.query';

@Injectable()
export class GetAssetCategoryDetailsHandler {
    constructor(
        @Inject(ASSET_CATEGORY_REPOSITORY)
        private readonly assetCategoryRepo: IAssetCategoryRepository,
    ) { }

    async execute(query: GetAssetCategoryDetailsQuery): Promise<AssetCategory> {
        const category = await this.assetCategoryRepo.findById(query.categoryId);
        if (!category) {
            throw new UseCaseException(
                `Asset category with id ${query.categoryId} not found`,
                GetAssetCategoryDetailsQuery.name,
            );
        }
        return category;
    }
}
