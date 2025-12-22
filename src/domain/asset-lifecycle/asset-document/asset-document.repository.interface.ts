import { AssetDocument } from './asset-document.entity';

export const ASSET_DOCUMENT_REPOSITORY = Symbol('ASSET_DOCUMENT_REPOSITORY');

export interface IAssetDocumentRepository {
  // --- Query Methods ---

  findById(id: string): Promise<AssetDocument | null>;

  findByAssetId(assetId: string): Promise<AssetDocument[]>;

  findAll(
    organizationId: string,
    options?: {
      documentType?: string; // e.g., 'CONTRACT', 'WARRANTY', 'MANUAL'
      limit?: number;
      offset?: number;
    },
  ): Promise<{ data: AssetDocument[]; total: number }>;

  findByUploader(userId: string): Promise<AssetDocument[]>;

  // --- Persistence Methods ---

  save(document: AssetDocument): Promise<AssetDocument>;

  saveMany(documents: AssetDocument[]): Promise<void>;

  delete(id: string): Promise<void>;
}
