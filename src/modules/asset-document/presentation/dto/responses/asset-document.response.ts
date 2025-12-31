import { Exclude, Expose } from 'class-transformer';
import { AssetDocument, AssetDocumentType } from '../../../domain';

@Exclude()
export class AssetDocumentResponse {
  @Expose()
  id: string;

  @Expose({ name: 'asset_id' })
  assetId: string;

  @Expose({ name: 'organization_id' })
  organizationId: string;

  @Expose({ name: 'document_type' })
  documentType: AssetDocumentType;

  @Expose({ name: 'document_name' })
  documentName: string;

  @Expose({ name: 'file_path' })
  filePath: string;

  @Expose({ name: 'file_type' })
  fileType: string;

  @Expose({ name: 'upload_date' })
  uploadDate: Date;

  @Expose({ name: 'uploaded_by_user_id' })
  uploadedByUserId: string;

  @Expose()
  description: string | null;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  constructor(entity: AssetDocument) {
    this.id = entity.id;
    this.assetId = entity.assetId;
    this.organizationId = entity.organizationId;
    this.documentType = entity.documentType;
    this.documentName = entity.documentName;
    this.filePath = entity.filePath;
    this.fileType = entity.fileType;
    this.uploadDate = entity.uploadDate;
    this.uploadedByUserId = entity.uploadedByUserId;
    this.description = entity.description;
    this.createdAt = entity.createdAt!;
    this.updatedAt = entity.updatedAt!;
  }
}
