import { Injectable, Inject } from '@nestjs/common';
import {
  ASSET_CATEGORY_REPOSITORY,
  AssetCategory,
  type IAssetCategoryRepository,
} from 'src/domain/asset-lifecycle/asset-category';
import {
  type IOrganizationRepository,
  ORGANIZATION_REPOSITORY,
} from 'src/domain/identity/organization';
import { EntityNotFoundException } from 'src/domain/core/exceptions/entity-not-found.exception';
import { FindAssetCategoryQuery } from './find-asset-category.query';

@Injectable()
export class FindAssetCategoryUseCase {
  constructor(
    @Inject(ASSET_CATEGORY_REPOSITORY)
    private readonly assetCategoryRepository: IAssetCategoryRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(query: FindAssetCategoryQuery): Promise<AssetCategory> {
    const existingOrganization = await this.organizationRepository.findById(
      query.organizationId,
    );
    if (!existingOrganization) {
      throw new EntityNotFoundException('Organization', query.organizationId);
    }

    const category = await this.assetCategoryRepository.findById(
      query.categoryId,
    );

    if (!category || category.organizationId !== query.organizationId) {
      throw new EntityNotFoundException('AssetCategory', query.categoryId);
    }

    return category;
  }
}
