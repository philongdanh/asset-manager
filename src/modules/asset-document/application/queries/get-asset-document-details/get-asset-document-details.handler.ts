import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  ASSET_DOCUMENT_REPOSITORY,
  type IAssetDocumentRepository,
  AssetDocument,
} from '../../../domain';
import { GetAssetDocumentDetailsQuery } from './get-asset-document-details.query';

@Injectable()
export class GetAssetDocumentDetailsHandler {
  constructor(
    @Inject(ASSET_DOCUMENT_REPOSITORY)
    private readonly documentRepo: IAssetDocumentRepository,
  ) {}

  async execute(query: GetAssetDocumentDetailsQuery): Promise<AssetDocument> {
    const document = await this.documentRepo.findById(query.id);
    if (!document) {
      throw new UseCaseException(
        `Asset document with id ${query.id} not found`,
        GetAssetDocumentDetailsQuery.name,
      );
    }
    return document;
  }
}
