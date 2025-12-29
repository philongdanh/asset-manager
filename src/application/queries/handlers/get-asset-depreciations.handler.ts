import { Injectable, Inject } from '@nestjs/common';
import {
    ASSET_DEPRECIATION_REPOSITORY,
    type IAssetDepreciationRepository,
    AssetDepreciation,
} from 'src/domain/finance-accounting/asset-depreciation';
import { GetAssetDepreciationsQuery } from '../asset-depreciation/get-asset-depreciations.query';

@Injectable()
export class GetAssetDepreciationsHandler {
    constructor(
        @Inject(ASSET_DEPRECIATION_REPOSITORY)
        private readonly depreciationRepo: IAssetDepreciationRepository,
    ) { }

    async execute(query: GetAssetDepreciationsQuery): Promise<{ data: AssetDepreciation[]; total: number }> {
        return await this.depreciationRepo.findAll(query.organizationId, query.options);
    }
}
