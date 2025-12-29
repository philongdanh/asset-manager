import { Asset, AssetStatus } from '../entities/asset.entity';

export const ASSET_REPOSITORY = Symbol('ASSET_REPOSITORY');

export interface IAssetRepository {
  // --- Query Methods ---

  findById(assetId: string): Promise<Asset | null>;

  findByCode(organizationId: string, assetCode: string): Promise<Asset | null>;

  find(
    organizationId: string,
    options?: {
      status?: AssetStatus;
      categoryId?: string;
      departmentId?: string;
      userId?: string;
      limit?: number;
      offset?: number;
      search?: string;
      includeDeleted?: boolean;
    },
  ): Promise<{ data: Asset[]; total: number }>;

  findByDepartment(departmentId: string): Promise<Asset[]>;

  findByUser(userId: string): Promise<Asset[]>;

  findByCategory(categoryId: string): Promise<Asset[]>;

  findByOrganization(organizationId: string): Promise<Asset[]>;

  // --- Validation Methods ---

  existsByCode(organizationId: string, assetCode: string): Promise<boolean>;

  existsById(assetId: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(asset: Asset): Promise<Asset>;

  update(asset: Asset): Promise<Asset>;

  saveMany(assets: Asset[]): Promise<void>;

  delete(assetId: string): Promise<void>; // Soft delete

  deleteMany(assetIds: string[]): Promise<void>; // Soft delete

  hardDelete(assetId: string): Promise<void>;

  hardDeleteMany(assetIds: string[]): Promise<void>;

  restore(assetId: string): Promise<void>;

  restoreMany(assetIds: string[]): Promise<void>;

  // --- Special Methods ---

  findByStatus(organizationId: string, status: AssetStatus): Promise<Asset[]>;

  findAssetsWithWarrantyExpiring(
    organizationId: string,
    daysThreshold: number,
  ): Promise<Asset[]>;

  findAssetsForMaintenance(organizationId: string): Promise<Asset[]>;
}
