import { AssetDocument, AssetDocumentType } from './asset-document.entity';

export const ASSET_DOCUMENT_REPOSITORY = Symbol('ASSET_DOCUMENT_REPOSITORY');

export interface IAssetDocumentRepository {
  // --- Query Methods ---

  findById(id: string): Promise<AssetDocument | null>;

  findByAssetId(assetId: string): Promise<AssetDocument[]>;

  findByOrganization(organizationId: string): Promise<AssetDocument[]>;

  findByUploader(uploadedByUserId: string): Promise<AssetDocument[]>;

  findByDocumentType(
    organizationId: string,
    documentType: AssetDocumentType,
  ): Promise<AssetDocument[]>;

  findAll(
    organizationId: string,
    options?: {
      documentType?: AssetDocumentType;
      assetId?: string;
      uploadedByUserId?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
      search?: string;
    },
  ): Promise<{ data: AssetDocument[]; total: number }>;

  // --- Validation Methods ---

  existsById(id: string): Promise<boolean>;

  existsByFilePath(filePath: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(document: AssetDocument): Promise<AssetDocument>;

  update(document: AssetDocument): Promise<AssetDocument>;

  saveMany(documents: AssetDocument[]): Promise<void>;

  delete(id: string): Promise<void>;

  deleteMany(ids: string[]): Promise<void>;

  deleteByAssetId(assetId: string): Promise<void>;

  // --- Special Methods ---

  getDocumentsSummary(organizationId: string): Promise<{
    totalCount: number;
    byType: Record<AssetDocumentType, number>;
    byAsset: Record<string, number>;
    recentUploads: Array<{
      documentId: string;
      documentName: string;
      assetId: string;
      uploadDate: Date;
      uploadedBy: string;
    }>;
  }>;

  findDocumentsByFileType(
    organizationId: string,
    fileType: string,
  ): Promise<AssetDocument[]>;

  findRecentDocuments(
    organizationId: string,
    limit: number,
  ): Promise<AssetDocument[]>;

  // --- Statistics Methods ---

  getDocumentTypeDistribution(
    organizationId: string,
  ): Promise<Record<AssetDocumentType, number>>;

  getUploadActivity(
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<
    Array<{
      date: string;
      count: number;
    }>
  >;

  // --- Bulk Operations ---

  findByAssetIds(assetIds: string[]): Promise<Record<string, AssetDocument[]>>;
}
