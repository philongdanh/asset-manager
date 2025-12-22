import { AssetTransfer } from './asset-transfer.entity';

export const ASSET_TRANSFER_REPOSITORY = Symbol('ASSET_TRANSFER_REPOSITORY');

export interface IAssetTransferRepository {
  // --- Query Methods ---

  findById(id: string): Promise<AssetTransfer | null>;

  findByAssetId(assetId: string): Promise<AssetTransfer[]>;

  findAll(
    organizationId: string,
    options?: {
      status?: string; // e.g., 'PENDING', 'COMPLETED', 'CANCELLED'
      limit?: number;
      offset?: number;
    },
  ): Promise<{ data: AssetTransfer[]; total: number }>;

  findByDepartment(departmentId: string): Promise<AssetTransfer[]>;

  findByUser(userId: string): Promise<AssetTransfer[]>;

  // --- Validation Methods ---

  hasActiveTransfer(assetId: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(transfer: AssetTransfer): Promise<AssetTransfer>;

  delete(id: string): Promise<void>;
}
