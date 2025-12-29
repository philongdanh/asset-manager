import { AssetDocumentType } from '../../../domain';

export class UploadAssetDocumentCommand {
  constructor(
    public readonly assetId: string,
    public readonly organizationId: string,
    public readonly uploadedByUserId: string,
    public readonly documentName: string,
    public readonly filePath: string,
    public readonly fileType: string,
    public readonly documentType: AssetDocumentType,
    public readonly description: string | null,
  ) {}
}
