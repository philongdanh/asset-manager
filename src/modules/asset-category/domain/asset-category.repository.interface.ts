import { AssetCategory } from './asset-category.entity';

export const ASSET_CATEGORY_REPOSITORY = Symbol('ASSET_CATEGORY_REPOSITORY');

export interface IAssetCategoryRepository {
  // --- Query Methods ---

  findById(categoryId: string): Promise<AssetCategory | null>;

  findByCode(
    organizationId: string,
    code: string,
  ): Promise<AssetCategory | null>;

  findAll(
    organizationId: string,
    options?: {
      limit?: number;
      offset?: number;
      includeDeleted?: boolean;
    },
  ): Promise<{ data: AssetCategory[]; total: number }>;

  findChildren(parentId: string): Promise<AssetCategory[]>;

  findRootCategories(organizationId: string): Promise<AssetCategory[]>;

  findByOrganization(organizationId: string): Promise<AssetCategory[]>;

  // --- Validation Methods ---

  existsByCode(organizationId: string, code: string): Promise<boolean>;

  existsById(categoryId: string): Promise<boolean>;

  hasDependencies(categoryId: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(category: AssetCategory): Promise<AssetCategory>;

  update(category: AssetCategory): Promise<AssetCategory>;

  saveMany(categories: AssetCategory[]): Promise<void>;

  delete(categoryId: string): Promise<void>; // Soft delete

  deleteMany(categoryIds: string[]): Promise<void>; // Soft delete

  hardDelete(categoryId: string): Promise<void>;

  hardDeleteMany(categoryIds: string[]): Promise<void>;

  restore(categoryId: string): Promise<void>;

  restoreMany(categoryIds: string[]): Promise<void>;
}
