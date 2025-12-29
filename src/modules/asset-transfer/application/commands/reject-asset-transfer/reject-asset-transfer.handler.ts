import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
    ASSET_TRANSFER_REPOSITORY,
    type IAssetTransferRepository,
    AssetTransfer,
} from '../../../domain';
import { RejectAssetTransferCommand } from './reject-asset-transfer.command';

@Injectable()
export class RejectAssetTransferHandler {
    constructor(
        @Inject(ASSET_TRANSFER_REPOSITORY)
        private readonly transferRepo: IAssetTransferRepository,
    ) { }

    async execute(cmd: RejectAssetTransferCommand): Promise<AssetTransfer> {
        const transfer = await this.transferRepo.findById(cmd.transferId);
        if (!transfer) {
            throw new UseCaseException(
                `Transfer with id ${cmd.transferId} not found`,
                RejectAssetTransferCommand.name,
            );
        }

        transfer.reject(cmd.rejectedByUserId, cmd.reason);
        return await this.transferRepo.update(transfer);
    }
}
