// src/domain/asset/asset.repository.interface.ts
import { Asset } from './asset.entity';

// Dùng symbol() để tạo token độc nhất cho NestJS Provider (Clean Code)
export const ASSET_REPOSITORY = Symbol('ASSET_REPOSITORY');

export interface IAssetRepository {
  // Phương thức cho Use Case: Kiểm tra mã tài sản đã tồn tại trong tổ chức chưa
  findByOrgAndCode(
    organizationId: number,
    assetCode: string,
  ): Promise<Asset | null>;
  save(asset: Asset): Promise<Asset>;
}
