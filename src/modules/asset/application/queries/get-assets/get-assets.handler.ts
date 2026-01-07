import { Injectable, Inject } from '@nestjs/common';
import {
  ASSET_REPOSITORY,
  type IAssetRepository,
} from '../../../domain/repositories/asset.repository.interface';
import { Asset } from '../../../domain/entities/asset.entity';
import { GetAssetsQuery } from './get-assets.query';

import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from '../../../../organization/domain';
import { USER_REPOSITORY, type IUserRepository } from '../../../../user/domain';
import {
  ASSET_CATEGORY_REPOSITORY,
  type IAssetCategoryRepository,
} from '../../../../asset-category/domain';
import { AssetResult } from '../../dtos/asset.result';

@Injectable()
export class GetAssetsHandler {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepo: IAssetRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepo: IOrganizationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(ASSET_CATEGORY_REPOSITORY)
    private readonly categoryRepo: IAssetCategoryRepository,
  ) {}

  async execute(
    query: GetAssetsQuery,
  ): Promise<{ data: AssetResult[]; total: number }> {
    const { data: assets, total } = await this.assetRepo.find(
      query.organizationId,
      query.options,
    );

    const assetResults = await Promise.all(
      assets.map(async (asset) => {
        const [organization, category, createdByUser] = await Promise.all([
          this.orgRepo.findById(asset.organizationId),
          this.categoryRepo.findById(asset.categoryId),
          this.userRepo.findById(asset.createdByUserId),
        ]);

        return {
          asset,
          organization,
          category,
          createdByUser,
        };
      }),
    );

    return { data: assetResults, total };
  }
}
