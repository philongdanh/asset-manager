import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  ASSET_DEPRECIATION_REPOSITORY,
  type IAssetDepreciationRepository,
  AssetDepreciation,
} from 'src/domain/finance-accounting/asset-depreciation';
import { GetAssetDepreciationByIdQuery } from '../asset-depreciation/get-asset-depreciation-by-id.query';

@Injectable()
export class GetAssetDepreciationDetailsHandler {
  constructor(
    @Inject(ASSET_DEPRECIATION_REPOSITORY)
    private readonly depreciationRepo: IAssetDepreciationRepository,
  ) {}

  async execute(
    query: GetAssetDepreciationByIdQuery,
  ): Promise<AssetDepreciation> {
    const depreciation = await this.depreciationRepo.findById(query.id);
    if (!depreciation) {
      throw new UseCaseException(
        `Asset depreciation with id ${query.id} not found`,
        GetAssetDepreciationByIdQuery.name,
      );
    }
    return depreciation;
  }
}
