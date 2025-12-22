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
import { FindAssetCategoriesQuery } from './find-asset-categories.query';

@Injectable()
export class FindAssetCategoriesUseCase {
  constructor(
    @Inject(ASSET_CATEGORY_REPOSITORY)
    private readonly assetCategoryRepository: IAssetCategoryRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(
    query: FindAssetCategoriesQuery,
  ): Promise<{ data: AssetCategory[]; total: number }> {
    const existingOrganization = await this.organizationRepository.findById(
      query.organizationId,
    );
    if (!existingOrganization) {
      throw new EntityNotFoundException('Organization', query.organizationId);
    }

    return await this.assetCategoryRepository.findAll(query.organizationId, {
      limit: query.limit,
      offset: query.offset,
    });
  }
}
