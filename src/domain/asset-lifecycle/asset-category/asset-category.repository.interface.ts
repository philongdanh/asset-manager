import { AssetCategory } from './asset-category.entity';

export const ASSET_CATEGORY_REPOSITORY = Symbol('ASSET_CATEGORY_REPOSITORY');

export interface IAssetCategoryRepository {
  findByOrganization(organizationId: string): Promise<AssetCategory[]>;

  findByOrganizationAndCode(
    organizationId: string,
    assetCategoryCode: string,
  ): Promise<AssetCategory | null>;

  save(assetCategory: AssetCategory): Promise<AssetCategory>;

  delete(assetCategoryId: string): Promise<void>;
}
