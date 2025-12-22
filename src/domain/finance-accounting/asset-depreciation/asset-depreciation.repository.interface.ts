import { AssetDepreciation } from './asset-depreciation.entity';

export const ASSET_DEPRECIATION_REPOSITORY = Symbol(
  'ASSET_DEPRECIATION_REPOSITORY',
);

export interface IAssetDepreciationRepository {
  // --- Query Methods ---

  findById(id: string): Promise<AssetDepreciation | null>;

  findByAssetId(assetId: string): Promise<AssetDepreciation[]>;

  findAll(
    organizationId: string,
    options?: {
      period?: string; // e.g., '2025-01', '2025-Q1'
      assetId?: string;
      limit?: number;
      offset?: number;
    },
  ): Promise<{ data: AssetDepreciation[]; total: number }>;

  findLatestByAssetId(assetId: string): Promise<AssetDepreciation | null>;

  // --- Validation Methods ---

  existsByPeriod(assetId: string, period: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(depreciation: AssetDepreciation): Promise<AssetDepreciation>;

  saveMany(depreciations: AssetDepreciation[]): Promise<void>;

  delete(id: string): Promise<void>;
}
