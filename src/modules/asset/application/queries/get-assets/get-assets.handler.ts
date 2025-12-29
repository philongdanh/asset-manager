import { Injectable, Inject } from '@nestjs/common';
import {
    ASSET_REPOSITORY,
    type IAssetRepository,
} from '../../../domain/repositories/asset.repository.interface';
import { Asset } from '../../../domain/entities/asset.entity';
import { GetAssetsQuery } from './get-assets.query';

@Injectable()
export class GetAssetsHandler {
    constructor(
        @Inject(ASSET_REPOSITORY)
        private readonly assetRepo: IAssetRepository,
    ) { }

    async execute(
        query: GetAssetsQuery,
    ): Promise<{ data: Asset[]; total: number }> {
        return await this.assetRepo.find(
            query.organizationId,
            query.options,
        );
    }
}
