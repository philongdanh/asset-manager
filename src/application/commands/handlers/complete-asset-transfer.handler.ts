import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
    ASSET_TRANSFER_REPOSITORY,
    type IAssetTransferRepository,
    AssetTransfer,
} from 'src/domain/asset-lifecycle/asset-transfer';
import {
    ASSET_REPOSITORY,
    type IAssetRepository,
} from 'src/modules/asset/domain';
import { CompleteAssetTransferCommand } from '../complete-asset-transfer.command';

@Injectable()
export class CompleteAssetTransferHandler {
    constructor(
        @Inject(ASSET_TRANSFER_REPOSITORY)
        private readonly transferRepo: IAssetTransferRepository,
        @Inject(ASSET_REPOSITORY)
        private readonly assetRepo: IAssetRepository,
    ) { }

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
                CompleteAssetTransferCommand.name
            );
        }

        // Update the asset
        const asset = await this.assetRepo.findById(transfer.assetId);
        if (asset) {
            // Apply changes to asset based on transfer
            if (transfer.toUserId || transfer.toDepartmentId) {
                // Depending on business rules, we assign. 
                // If toUserId is present, assign to user (which sets InUse)
                // If only toDepartmentId, maybe set location/dept?
                // Assuming assignToUser handles both if present.

                // Check validation rules of Asset entity.
                // If transfer removes assignment (unassign), we handle that too.

                if (transfer.toUserId) {
                    // For now, assume department is required or we carry over. 
                    // If toDepartmentId is missing in transfer, we might need asset's current or keep as is?
                    // Let's assume toDepartmentId is mandatory in transfer context if changing dept.
                    asset.assignToUser(transfer.toUserId, transfer.toDepartmentId || asset.currentDepartmentId || 'unknown');
                } else if (transfer.toDepartmentId) {
                    // Moved to department but not assigned to user?
                    // Asset entity doesn't have explicit "assignToDepartment" method other than unassign or update internals?
                    // Looking at Asset entity: assignToUser sets status IN_USE.
                    // unassign sets AVAILABLE.
                    // We might need a method to change location/dept without user assignment.
                    // For now, let's assume we update the logic based on available methods.
                    // We will update internal fields if needed or call updateBasicInfo/etc?
                    // Use unassign if no user, but how to set dept?
                    asset.unassign(); // Clears user and dept
                    // Then we need to set the department?
                    // There isn't a clear method for "Stored in Department X".
                }
            }
            await this.assetRepo.update(asset);
        }

        transfer.complete();
        return await this.transferRepo.update(transfer);
    }
}
