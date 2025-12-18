import { Injectable, Inject } from '@nestjs/common';
import {
  ASSET_CATEGORY_REPOSITORY,
  AssetCategory,
  type IAssetCategoryRepository,
} from 'src/domain/modules/asset-category';
import { EntityNotFoundException } from 'src/domain/core/exceptions/entity-not-found.exception';
import {
  type IOrganizationRepository,
  ORGANIZATION_REPOSITORY,
} from 'src/domain/modules/organization';

@Injectable()
export class GetAssetCategoryListUseCase {
  constructor(
    @Inject(ASSET_CATEGORY_REPOSITORY)
    private readonly assetCategoryRepo: IAssetCategoryRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepository: IOrganizationRepository,
  ) {}

  async execute(organizaionId: string): Promise<AssetCategory[]> {
    const organization = await this.orgRepository.findById(organizaionId);
    if (!organization) {
      throw new EntityNotFoundException('Organization', organizaionId);
    }

    const assetCategories = await this.assetCategoryRepo.find();
    return assetCategories;
  }
}
