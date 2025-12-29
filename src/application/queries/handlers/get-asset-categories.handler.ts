import { Injectable, Inject } from '@nestjs/common';
import {
    ASSET_CATEGORY_REPOSITORY,
    type IAssetCategoryRepository,
    AssetCategory,
} from 'src/domain/asset-lifecycle/asset-category';
import { GetAssetCategoriesQuery } from '../get-asset-categories.query';

@Injectable()
export class GetAssetCategoriesHandler {
    constructor(
        @Inject(ASSET_CATEGORY_REPOSITORY)
        private readonly assetCategoryRepo: IAssetCategoryRepository,
    ) { }

    async execute(
        query: GetAssetCategoriesQuery,
    ): Promise<{ data: AssetCategory[]; total: number }> {
        return await this.assetCategoryRepo.findAll(
            query.organizationId,
            query.options,
        );
    }
}
