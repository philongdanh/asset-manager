import { AssetCategory } from './asset-category.entity';

export const ASSET_CATEGORY_REPOSITORY = Symbol('ASSET_CATEGORY_REPOSITORY');

export interface IAssetCategoryRepository {
  // --- Query Methods ---

  findById(id: string): Promise<AssetCategory | null>;

  findByCode(
    organizationId: string,
    code: string,
  ): Promise<AssetCategory | null>;

  findAll(
    organizationId: string,
    options?: {
      limit?: number;
      offset?: number;
    },
  ): Promise<{ data: AssetCategory[]; total: number }>;

  findChildren(parentId: string): Promise<AssetCategory[]>;

  findRootCategories(organizationId: string): Promise<AssetCategory[]>;

  // --- Validation Methods ---

  existsByCode(organizationId: string, code: string): Promise<boolean>;

  hasDependencies(id: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(category: AssetCategory): Promise<AssetCategory>;

  delete(id: string): Promise<void>;
}
