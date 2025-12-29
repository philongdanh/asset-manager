import { DepreciationMethod } from 'src/domain/finance-accounting/asset-depreciation';

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
