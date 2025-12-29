import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
    ASSET_TRANSFER_REPOSITORY,
    type IAssetTransferRepository,
    AssetTransfer,
} from 'src/domain/asset-lifecycle/asset-transfer';
import { CancelAssetTransferCommand } from '../cancel-asset-transfer.command';

@Injectable()
export class CancelAssetTransferHandler {
    constructor(
        @Inject(ASSET_TRANSFER_REPOSITORY)
        private readonly transferRepo: IAssetTransferRepository,
    ) { }

    async execute(cmd: CancelAssetTransferCommand): Promise<AssetTransfer> {
        const transfer = await this.transferRepo.findById(cmd.transferId);
        if (!transfer) {
            throw new UseCaseException(
                `Transfer with id ${cmd.transferId} not found`,
                CancelAssetTransferCommand.name,
            );
        }

        transfer.cancel(cmd.reason);
        return await this.transferRepo.update(transfer);
    }
}
