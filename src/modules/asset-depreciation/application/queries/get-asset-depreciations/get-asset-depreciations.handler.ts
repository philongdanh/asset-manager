import { Injectable, Inject } from '@nestjs/common';
import {
  ASSET_DEPRECIATION_REPOSITORY,
  type IAssetDepreciationRepository,
} from 'src/modules/asset-depreciation/domain';
import { GetAssetDepreciationsQuery } from './get-asset-depreciations.query';
import {
  ASSET_REPOSITORY,
  type IAssetRepository,
} from '../../../../asset/domain';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from '../../../../organization/domain';
import { AssetDepreciationResult } from '../../dtos/asset-depreciation.result';

@Injectable()
export class GetAssetDepreciationsHandler {
  constructor(
    @Inject(ASSET_DEPRECIATION_REPOSITORY)
    private readonly depreciationRepo: IAssetDepreciationRepository,
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepo: IAssetRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepo: IOrganizationRepository,
  ) {}

  async execute(
    query: GetAssetDepreciationsQuery,
  ): Promise<{ data: AssetDepreciationResult[]; total: number }> {
    const { data: list, total } = await this.depreciationRepo.findAll(
      query.organizationId,
      query.options,
    );

    const enrichedData = await Promise.all(
      list.map(async (depreciation) => {
        const [asset, organization] = await Promise.all([
          this.assetRepo.findById(depreciation.assetId),
          this.orgRepo.findById(depreciation.organizationId),
        ]);

        return {
          depreciation,
          asset,
          organization,
        };
      }),
    );

    return { data: enrichedData, total };
  }
}
