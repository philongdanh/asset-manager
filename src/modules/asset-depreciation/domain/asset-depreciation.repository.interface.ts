import {
  AssetDepreciation,
  DepreciationMethod,
} from './asset-depreciation.entity';

export const ASSET_DEPRECIATION_REPOSITORY = Symbol(
  'ASSET_DEPRECIATION_REPOSITORY',
);

export interface IAssetDepreciationRepository {
  // --- Query Methods ---

  findById(id: string): Promise<AssetDepreciation | null>;

  findByAssetId(assetId: string): Promise<AssetDepreciation[]>;

  findByOrganization(organizationId: string): Promise<AssetDepreciation[]>;

  findByAccountingEntry(
    accountingEntryId: string,
  ): Promise<AssetDepreciation | null>;

  findByMethod(
    organizationId: string,
    method: DepreciationMethod,
  ): Promise<AssetDepreciation[]>;

  findAll(
    organizationId: string,
    options?: {
      method?: DepreciationMethod;
      assetId?: string;
      startDate?: Date;
      endDate?: Date;
      minValue?: number;
      maxValue?: number;
      limit?: number;
      offset?: number;
      includeAssetInfo?: boolean;
    },
  ): Promise<{ data: AssetDepreciation[]; total: number }>;

  findLatestByAssetId(assetId: string): Promise<AssetDepreciation | null>;

  findByDateRange(
    assetId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<AssetDepreciation[]>;

  // --- Validation Methods ---

  existsById(id: string): Promise<boolean>;

  existsByDateAndAsset(assetId: string, date: Date): Promise<boolean>;

  // --- Persistence Methods ---

  save(depreciation: AssetDepreciation): Promise<AssetDepreciation>;

  update(depreciation: AssetDepreciation): Promise<AssetDepreciation>;

  saveMany(depreciations: AssetDepreciation[]): Promise<void>;

  delete(id: string): Promise<void>;

  deleteMany(ids: string[]): Promise<void>;

  deleteByAssetId(assetId: string): Promise<void>;

  deleteByAccountingEntry(accountingEntryId: string): Promise<void>;

  // --- Special Methods ---

  getDepreciationSummary(
    organizationId: string,
    fiscalYear?: number,
  ): Promise<{
    totalDepreciation: number;
    totalAssets: number;
    byMethod: Record<DepreciationMethod, { count: number; value: number }>;
    byMonth: Array<{
      month: string;
      count: number;
      totalValue: number;
    }>;
  }>;

  getAssetDepreciationHistory(assetId: string): Promise<{
    totalDepreciation: number;
    remainingValue: number;
    depreciations: AssetDepreciation[];
    yearlyBreakdown: Array<{
      year: number;
      depreciation: number;
      accumulated: number;
      remaining: number;
    }>;
  }>;

  findDepreciationsWithoutAccountingEntry(
    organizationId: string,
  ): Promise<AssetDepreciation[]>;

  // --- Statistics Methods ---

  getMonthlyDepreciationReport(
    organizationId: string,
    year: number,
    month: number,
  ): Promise<{
    totalDepreciation: number;
    byAssetCategory: Record<string, number>;
    byDepartment: Record<string, number>;
    topDepreciatingAssets: Array<{
      assetId: string;
      assetName: string;
      depreciationValue: number;
    }>;
  }>;

  // --- Bulk Operations ---

  getDepreciationsByAssetIds(
    assetIds: string[],
  ): Promise<Record<string, AssetDepreciation[]>>;
}
