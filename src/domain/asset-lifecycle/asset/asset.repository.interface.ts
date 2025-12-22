import { Asset } from './asset.entity';

export const ASSET_REPOSITORY = Symbol('ASSET_REPOSITORY');

export interface IAssetRepository {
  findByOrganization(organizationId: string): Promise<Asset[]>;

  findByDepartment(departmentId: string): Promise<Asset[]>;

  findByOrganizationAndCode(
    organizationId: string,
    code: string,
  ): Promise<Asset | null>;

  findByDepartmentAndCode(
    departmentId: string,
    code: string,
  ): Promise<Asset | null>;

  findById(assetId: string): Promise<Asset | null>;

  save(asset: Asset): Promise<Asset>;
}
