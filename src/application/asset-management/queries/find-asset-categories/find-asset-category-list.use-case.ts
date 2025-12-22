import { Injectable, Inject } from '@nestjs/common';
import {
  ASSET_CATEGORY_REPOSITORY,
  AssetCategory,
  type IAssetCategoryRepository,
} from 'src/domain/asset-lifecycle/asset-category';
import { EntityNotFoundException } from 'src/domain/core/exceptions/entity-not-found.exception';
import {
  type IOrganizationRepository,
  ORGANIZATION_REPOSITORY,
} from 'src/domain/identity/organization';

@Injectable()
export class FindAssetCategoryListUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(ASSET_CATEGORY_REPOSITORY)
    private readonly assetCategoryRepository: IAssetCategoryRepository,
  ) {}

  async execute(organizaionId: string): Promise<AssetCategory[]> {
    const organization =
      await this.organizationRepository.findById(organizaionId);
    if (!organization) {
      throw new EntityNotFoundException('Organization', organizaionId);
    }

    const assetCategories =
      await this.assetCategoryRepository.findByOrganization(organizaionId);
    return assetCategories;
  }
}
