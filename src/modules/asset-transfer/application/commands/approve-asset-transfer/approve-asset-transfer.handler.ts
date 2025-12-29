import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import {
  ASSET_TRANSFER_REPOSITORY,
  type IAssetTransferRepository,
  AssetTransfer,
} from '../../../domain';
import { ApproveAssetTransferCommand } from './approve-asset-transfer.command';

@Injectable()
export class ApproveAssetTransferHandler {
  constructor(
    @Inject(ASSET_TRANSFER_REPOSITORY)
    private readonly transferRepo: IAssetTransferRepository,
  ) {}

  async execute(cmd: ApproveAssetTransferCommand): Promise<AssetTransfer> {
    const transfer = await this.transferRepo.findById(cmd.transferId);
    if (!transfer) {
      throw new UseCaseException(
        `Transfer with id ${cmd.transferId} not found`,
        ApproveAssetTransferCommand.name,
      );
    }

    transfer.approve(cmd.approvedByUserId);
    return await this.transferRepo.update(transfer);
  }
}
