import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
    ASSET_DISPOSAL_REPOSITORY,
    type IAssetDisposalRepository,
    AssetDisposal,
} from 'src/domain/asset-lifecycle/asset-disposal';
import { GetAssetDisposalByIdQuery } from '../asset-disposal/get-asset-disposal-by-id.query';

@Injectable()
export class GetAssetDisposalDetailsHandler {
    constructor(
        @Inject(ASSET_DISPOSAL_REPOSITORY)
        private readonly disposalRepo: IAssetDisposalRepository,
    ) { }

    async execute(query: GetAssetDisposalByIdQuery): Promise<AssetDisposal> {
        const disposal = await this.disposalRepo.findById(query.id);
        if (!disposal) {
            throw new UseCaseException(
                `Asset disposal with id ${query.id} not found`,
                GetAssetDisposalByIdQuery.name,
            );
        }
        return disposal;
    }
}
