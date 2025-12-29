import { DepreciationMethod } from 'src/modules/asset-depreciation/domain';

export class GetAssetDepreciationsQuery {
  constructor(
    public readonly organizationId: string,
    public readonly options?: {
      method?: DepreciationMethod;
      assetId?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    },
  ) {}
}
