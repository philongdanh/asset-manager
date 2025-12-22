import { Asset } from './asset.entity';

export const ASSET_REPOSITORY = Symbol('ASSET_REPOSITORY');

export interface IAssetRepository {
  // --- Query Methods ---

  findById(assetId: string): Promise<Asset | null>;

  findByCode(organizationId: string, assetCode: string): Promise<Asset | null>;

  findAll(
    organizationId: string,
    options?: {
      status?: string;
      categoryId?: string;
      limit?: number;
      offset?: number;
    },
  ): Promise<{ data: Asset[]; total: number }>;

  findByDepartment(departmentId: string): Promise<Asset[]>;

  findByUser(userId: string): Promise<Asset[]>;

  findByCategory(categoryId: string): Promise<Asset[]>;

  // --- Validation Methods ---

  existsByCode(organizationId: string, assetCode: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(asset: Asset): Promise<Asset>;

  saveMany(assets: Asset[]): Promise<void>;

  delete(assetId: string): Promise<void>;
}
