import { Injectable, Inject } from '@nestjs/common';
import {
  ASSET_DOCUMENT_REPOSITORY,
  type IAssetDocumentRepository,
  AssetDocument,
} from 'src/domain/asset-lifecycle/asset-document';
import { GetAssetDocumentsQuery } from '../asset-document/get-asset-documents.query';

@Injectable()
export class GetAssetDocumentsHandler {
  constructor(
    @Inject(ASSET_DOCUMENT_REPOSITORY)
    private readonly documentRepo: IAssetDocumentRepository,
  ) {}

  async execute(
    query: GetAssetDocumentsQuery,
  ): Promise<{ data: AssetDocument[]; total: number }> {
    return await this.documentRepo.findAll(query.organizationId, query.options);
  }
}
