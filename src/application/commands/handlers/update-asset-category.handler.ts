import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
    ASSET_CATEGORY_REPOSITORY,
    type IAssetCategoryRepository,
    AssetCategory,
} from 'src/domain/asset-lifecycle/asset-category';
import { UpdateAssetCategoryCommand } from '../update-asset-category.command';

@Injectable()
export class UpdateAssetCategoryHandler {
    constructor(
        @Inject(ASSET_CATEGORY_REPOSITORY)
        private readonly assetCategoryRepo: IAssetCategoryRepository,
    ) { }

    async execute(cmd: UpdateAssetCategoryCommand): Promise<AssetCategory> {
        const category = await this.assetCategoryRepo.findById(cmd.categoryId);
        if (!category) {
            throw new UseCaseException(
                `Asset category with id ${cmd.categoryId} not found`,
                UpdateAssetCategoryCommand.name,
            );
        }

        if (cmd.code !== category.code) {
            const existsByCode = await this.assetCategoryRepo.existsByCode(
                category.organizationId,
                cmd.code,
            );
            if (existsByCode) {
                throw new UseCaseException(
                    `Asset category with code ${cmd.code} already exists`,
                    UpdateAssetCategoryCommand.name,
                );
            }
        }

        if (cmd.parentId) {
            if (cmd.parentId === cmd.categoryId) {
                throw new UseCaseException(
                    `A category cannot be its own parent`,
                    UpdateAssetCategoryCommand.name,
                );
            }
            const parentExists = await this.assetCategoryRepo.existsById(
                cmd.parentId,
            );
            if (!parentExists) {
                throw new UseCaseException(
                    `Parent category with id ${cmd.parentId} does not exist`,
                    UpdateAssetCategoryCommand.name,
                );
            }
        }

        category.updateInfo(cmd.categoryName, cmd.code);
        category.changeParent(cmd.parentId);

        return await this.assetCategoryRepo.update(category);
    }
}
