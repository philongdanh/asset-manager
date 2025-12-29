import { Injectable, Inject } from '@nestjs/common';
import {
  ASSET_TRANSFER_REPOSITORY,
  type IAssetTransferRepository,
  AssetTransfer,
} from '../../../domain';
import { GetAssetTransfersQuery } from './get-asset-transfers.query';

@Injectable()
export class GetAssetTransfersHandler {
  constructor(
    @Inject(ASSET_TRANSFER_REPOSITORY)
    private readonly transferRepo: IAssetTransferRepository,
  ) {}

  async execute(
    query: GetAssetTransfersQuery,
  ): Promise<{ data: AssetTransfer[]; total: number }> {
    return await this.transferRepo.findAll(query.organizationId, query.options);
  }
}
