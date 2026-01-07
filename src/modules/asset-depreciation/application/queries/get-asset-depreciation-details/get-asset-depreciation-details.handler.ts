import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import {
  ASSET_DEPRECIATION_REPOSITORY,
  type IAssetDepreciationRepository,
} from 'src/modules/asset-depreciation/domain';
import { GetAssetDepreciationDetailsQuery } from './get-asset-depreciation-details.query';
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
export class GetAssetDepreciationDetailsHandler {
  constructor(
    @Inject(ASSET_DEPRECIATION_REPOSITORY)
    private readonly depreciationRepo: IAssetDepreciationRepository,
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepo: IAssetRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepo: IOrganizationRepository,
  ) { }

  async execute(
    query: GetAssetDepreciationDetailsQuery,
  ): Promise<AssetDepreciationResult> {
    const depreciation = await this.depreciationRepo.findById(query.id);
    if (!depreciation) {
      throw new UseCaseException(
        `Asset depreciation with id ${query.id} not found`,
        GetAssetDepreciationDetailsQuery.name,
      );
    }

    const [asset, organization] = await Promise.all([
      this.assetRepo.findById(depreciation.assetId),
      this.orgRepo.findById(depreciation.organizationId),
    ]);

    return {
      depreciation,
      asset,
      organization,
    };
  }
}
