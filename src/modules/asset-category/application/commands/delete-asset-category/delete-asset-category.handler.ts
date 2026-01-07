import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import {
  ASSET_CATEGORY_REPOSITORY,
  type IAssetCategoryRepository,
} from '../../../domain';
import { DeleteAssetCategoryCommand } from './delete-asset-category.command';

@Injectable()
export class DeleteAssetCategoryHandler {
  constructor(
    @Inject(ASSET_CATEGORY_REPOSITORY)
    private readonly assetCategoryRepo: IAssetCategoryRepository,
  ) {}

  async execute(cmd: DeleteAssetCategoryCommand): Promise<void> {
    const category = await this.assetCategoryRepo.findById(cmd.categoryId);
    if (!category) {
      return;
    }

    if (cmd.organizationId && category.organizationId !== cmd.organizationId) {
      throw new UseCaseException(
        `You do not have permission to delete this asset category`,
        DeleteAssetCategoryCommand.name,
      );
    }

    const hasDependencies = await this.assetCategoryRepo.hasDependencies(
      cmd.categoryId,
    );
    if (hasDependencies) {
      throw new UseCaseException(
        `Cannot delete asset category ${cmd.categoryId} because it has dependencies (assets or sub-categories).`,
        DeleteAssetCategoryCommand.name,
      );
    }

    await this.assetCategoryRepo.delete(cmd.categoryId);
  }
}
