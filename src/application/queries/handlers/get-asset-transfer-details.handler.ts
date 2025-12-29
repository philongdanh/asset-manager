import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
    ASSET_TRANSFER_REPOSITORY,
    type IAssetTransferRepository,
    AssetTransfer,
} from 'src/domain/asset-lifecycle/asset-transfer';
import { GetAssetTransferDetailsQuery } from '../get-asset-transfer-details.query';

@Injectable()
export class GetAssetTransferDetailsHandler {
    constructor(
        @Inject(ASSET_TRANSFER_REPOSITORY)
        private readonly transferRepo: IAssetTransferRepository,
    ) { }

    async execute(query: GetAssetTransferDetailsQuery): Promise<AssetTransfer> {
        const transfer = await this.transferRepo.findById(query.transferId);
        if (!transfer) {
            throw new UseCaseException(
                `Transfer with id ${query.transferId} not found`,
                GetAssetTransferDetailsQuery.name,
            );
        }
        return transfer;
    }
}
