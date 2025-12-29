import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
    ASSET_DISPOSAL_REPOSITORY,
    type IAssetDisposalRepository,
    AssetDisposal,
} from '../../../domain';
import { GetAssetDisposalDetailsQuery } from './get-asset-disposal-details.query';

@Injectable()
export class GetAssetDisposalDetailsHandler {
    constructor(
        @Inject(ASSET_DISPOSAL_REPOSITORY)
        private readonly disposalRepo: IAssetDisposalRepository,
    ) { }

    async execute(query: GetAssetDisposalDetailsQuery): Promise<AssetDisposal> {
        const disposal = await this.disposalRepo.findById(query.id);
        if (!disposal) {
            throw new UseCaseException(
                `Asset disposal with id ${query.id} not found`,
                GetAssetDisposalDetailsQuery.name,
            );
        }
        return disposal;
    }
}
