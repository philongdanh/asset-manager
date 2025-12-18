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

export type GetAssetCategoryCommand = {
  orgId: string;
};

@Injectable()
export class GetAssetCategoryListUseCase {
  constructor(
    @Inject(ASSET_CATEGORY_REPOSITORY)
    private readonly assetCategoryRepo: IAssetCategoryRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepository: IOrganizationRepository,
  ) {}

  async execute(command: GetAssetCategoryCommand): Promise<AssetCategory[]> {
    const { orgId } = command;

    // Validate organization existence
    const organization = await this.orgRepository.findById(orgId);
    if (!organization) {
      throw new EntityNotFoundException('Organization', orgId);
    }

    const assetCategories = await this.assetCategoryRepo.find();

    return assetCategories;
  }
}
