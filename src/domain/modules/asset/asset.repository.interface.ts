import { Asset } from './asset.entity';

export const ASSET_REPOSITORY = Symbol('ASSET_REPOSITORY');

export interface IAssetRepository {
  find(): Promise<Asset[]>;
  findByOrgAndCode(orgId: string, code: string): Promise<Asset | null>;
  save(asset: Asset): Promise<Asset>;
}
