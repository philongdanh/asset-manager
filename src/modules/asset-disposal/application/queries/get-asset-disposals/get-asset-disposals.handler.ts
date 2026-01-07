import { Injectable, Inject } from '@nestjs/common';
import {
  ASSET_DISPOSAL_REPOSITORY,
  type IAssetDisposalRepository,
  AssetDisposal,
} from '../../../domain';
import { GetAssetDisposalsQuery } from './get-asset-disposals.query';
import {
  ASSET_REPOSITORY,
  type IAssetRepository,
} from '../../../../asset/domain';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from '../../../../organization/domain';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../../../user/domain';
import { AssetDisposalResult } from '../../dtos/asset-disposal.result';

@Injectable()
export class GetAssetDisposalsHandler {
  constructor(
    @Inject(ASSET_DISPOSAL_REPOSITORY)
    private readonly disposalRepo: IAssetDisposalRepository,
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepo: IAssetRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepo: IOrganizationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) { }

  async execute(
    query: GetAssetDisposalsQuery,
  ): Promise<{ data: AssetDisposalResult[]; total: number }> {
    const { data: disposals, total } = await this.disposalRepo.findAll(
      query.organizationId,
      query.options,
    );

    const enrichedData = await Promise.all(
      disposals.map(async (disposal) => {
        const [asset, organization, approvedByUser] = await Promise.all([
          this.assetRepo.findById(disposal.assetId),
          this.orgRepo.findById(disposal.organizationId),
          disposal.approvedByUserId
            ? this.userRepo.findById(disposal.approvedByUserId)
            : null,
        ]);

        return {
          disposal,
          asset,
          organization,
          approvedByUser,
        };
      }),
    );

    return { data: enrichedData, total };
  }
}
