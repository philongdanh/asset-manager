import { AssetDocumentType } from '../../../domain';

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
