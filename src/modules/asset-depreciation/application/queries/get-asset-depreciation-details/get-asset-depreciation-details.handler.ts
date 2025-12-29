import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
    ASSET_DEPRECIATION_REPOSITORY,
    type IAssetDepreciationRepository,
    AssetDepreciation,
} from 'src/modules/asset-depreciation/domain';
import { GetAssetDepreciationDetailsQuery } from './get-asset-depreciation-details.query';

@Injectable()
export class GetAssetDepreciationDetailsHandler {
    constructor(
        @Inject(ASSET_DEPRECIATION_REPOSITORY)
        private readonly depreciationRepo: IAssetDepreciationRepository,
    ) { }

    async execute(
        query: GetAssetDepreciationDetailsQuery,
    ): Promise<AssetDepreciation> {
        const depreciation = await this.depreciationRepo.findById(query.id);
        if (!depreciation) {
            throw new UseCaseException(
                `Asset depreciation with id ${query.id} not found`,
                GetAssetDepreciationDetailsQuery.name,
            );
        }
        return depreciation;
    }
}
