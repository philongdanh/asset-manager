import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  ASSET_DOCUMENT_REPOSITORY,
  type IAssetDocumentRepository,
  AssetDocument,
} from 'src/domain/asset-lifecycle/asset-document';
import { GetAssetDocumentByIdQuery } from '../asset-document/get-asset-document-by-id.query';

@Injectable()
export class GetAssetDocumentDetailsHandler {
  constructor(
    @Inject(ASSET_DOCUMENT_REPOSITORY)
    private readonly documentRepo: IAssetDocumentRepository,
  ) {}

  async execute(query: GetAssetDocumentByIdQuery): Promise<AssetDocument> {
    const document = await this.documentRepo.findById(query.id);
    if (!document) {
      throw new UseCaseException(
        `Asset document with id ${query.id} not found`,
        GetAssetDocumentByIdQuery.name,
      );
    }
    return document;
  }
}
