import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import {
  ASSET_DISPOSAL_REPOSITORY,
  type IAssetDisposalRepository,
} from '../../../domain';
import { GetAssetDisposalDetailsQuery } from './get-asset-disposal-details.query';
import {
  ASSET_REPOSITORY,
  type IAssetRepository,
} from '../../../../asset/domain';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from '../../../../organization/domain';
import { USER_REPOSITORY, type IUserRepository } from '../../../../user/domain';
import { AssetDisposalResult } from '../../dtos/asset-disposal.result';

@Injectable()
export class GetAssetDisposalDetailsHandler {
  constructor(
    @Inject(ASSET_DISPOSAL_REPOSITORY)
    private readonly disposalRepo: IAssetDisposalRepository,
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepo: IAssetRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepo: IOrganizationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(
    query: GetAssetDisposalDetailsQuery,
  ): Promise<AssetDisposalResult> {
    const disposal = await this.disposalRepo.findById(query.id);
    if (!disposal) {
      throw new UseCaseException(
        `Asset disposal with id ${query.id} not found`,
        GetAssetDisposalDetailsQuery.name,
      );
    }

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
  }
}
