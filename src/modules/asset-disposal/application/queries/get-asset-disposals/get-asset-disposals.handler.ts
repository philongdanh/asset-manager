import { Injectable, Inject } from '@nestjs/common';
import {
  ASSET_DISPOSAL_REPOSITORY,
  type IAssetDisposalRepository,
  AssetDisposal,
} from '../../../domain';
import { GetAssetDisposalsQuery } from './get-asset-disposals.query';

@Injectable()
export class GetAssetDisposalsHandler {
  constructor(
    @Inject(ASSET_DISPOSAL_REPOSITORY)
    private readonly disposalRepo: IAssetDisposalRepository,
  ) {}

  async execute(
    query: GetAssetDisposalsQuery,
  ): Promise<{ data: AssetDisposal[]; total: number }> {
    return await this.disposalRepo.findAll(query.organizationId, query.options);
  }
}
