import { AssetCategory } from './asset-category.entity';

export const ASSET_CATEGORY_REPOSITORY = Symbol('ASSET_CATEGORY_REPOSITORY');

export interface IAssetCategoryRepository {
  findByOrganization(organizationId: string): Promise<AssetCategory[]>;

  findByOrganizationAndId(
    organizationId: string,
    id: string,
  ): Promise<AssetCategory | null>;

  findByOrganizationAndCode(
    organizationId: string,
    code: string,
  ): Promise<AssetCategory | null>;

  save(assetCategory: AssetCategory): Promise<AssetCategory>;

  delete(assetCategoryId: string): Promise<void>;
}
