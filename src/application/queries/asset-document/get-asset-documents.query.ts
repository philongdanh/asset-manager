import { AssetDocumentType } from 'src/domain/asset-lifecycle/asset-document';

export class GetAssetDocumentsQuery {
  constructor(
    public readonly organizationId: string,
    public readonly options?: {
      documentType?: AssetDocumentType;
      assetId?: string;
      limit?: number;
      offset?: number;
    },
  ) {}
}
