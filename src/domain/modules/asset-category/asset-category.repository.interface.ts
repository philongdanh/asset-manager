import { AssetCategory } from './asset-category.entity';

export const ASSET_CATEGORY_REPOSITORY = Symbol('ASSET_CATEGORY_REPOSITORY');

export interface IAssetCategoryRepository {
  find(): Promise<AssetCategory[]>;
  findByOrgAndCode(orgId: string, code: string): Promise<AssetCategory | null>;
  save(category: AssetCategory): Promise<AssetCategory>;
  update(category: AssetCategory): Promise<void>;
  delete(category: string): Promise<void>;
}
