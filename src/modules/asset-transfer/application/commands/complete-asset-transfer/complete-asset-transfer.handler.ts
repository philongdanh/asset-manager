import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import {
  ASSET_TRANSFER_REPOSITORY,
  type IAssetTransferRepository,
  AssetTransfer,
} from '../../../domain';
import {
  ASSET_REPOSITORY,
  type IAssetRepository,
} from 'src/modules/asset/domain';
import { CompleteAssetTransferCommand } from './complete-asset-transfer.command';

@Injectable()
export class CompleteAssetTransferHandler {
  constructor(
    @Inject(ASSET_TRANSFER_REPOSITORY)
    private readonly transferRepo: IAssetTransferRepository,
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepo: IAssetRepository,
  ) {}

  async execute(cmd: CompleteAssetTransferCommand): Promise<AssetTransfer> {
    const transfer = await this.transferRepo.findById(cmd.transferId);
    if (!transfer) {
      throw new UseCaseException(
        `Transfer with id ${cmd.transferId} not found`,
        CompleteAssetTransferCommand.name,
      );
    }

    if (!transfer.isApproved()) {
      throw new UseCaseException(
        'Cannot complete a transfer that is not approved',
        CompleteAssetTransferCommand.name,
      );
    }

    // Update the asset
    const asset = await this.assetRepo.findById(transfer.assetId);
    if (asset) {
      // Apply changes to asset based on transfer
      if (transfer.toUserId || transfer.toDepartmentId) {
        if (transfer.toUserId) {
          asset.assignToUser(
            transfer.toUserId,
            transfer.toDepartmentId || asset.currentDepartmentId || 'unknown',
          );
        } else if (transfer.toDepartmentId) {
          asset.unassign();
          // Note: In a real system, you might want a specific method for department storage
        }
      }
      await this.assetRepo.update(asset);
    }

    transfer.complete();
    return await this.transferRepo.update(transfer);
  }
}
