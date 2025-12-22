import { AssetDisposal } from './asset-disposal.entity';

export const ASSET_DISPOSAL_REPOSITORY = Symbol('ASSET_DISPOSAL_REPOSITORY');

export interface IAssetDisposalRepository {
  // --- Query Methods ---

  findById(id: string): Promise<AssetDisposal | null>;

  findByAssetId(assetId: string): Promise<AssetDisposal[]>;

  findAll(
    organizationId: string,
    options?: {
      status?: string; // PENDING, APPROVED, REJECTED
      disposalType?: string;
      limit?: number;
      offset?: number;
    },
  ): Promise<{ data: AssetDisposal[]; total: number }>;

  findByApprover(userId: string): Promise<AssetDisposal[]>;

  // --- Validation Methods ---

  hasPendingDisposal(assetId: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(disposal: AssetDisposal): Promise<AssetDisposal>;

  delete(id: string): Promise<void>;
}
