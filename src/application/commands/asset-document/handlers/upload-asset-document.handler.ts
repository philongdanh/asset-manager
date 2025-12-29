import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import { ID_GENERATOR, type IIdGenerator } from 'src/domain/core/interfaces';
import {
  ASSET_DOCUMENT_REPOSITORY,
  type IAssetDocumentRepository,
  AssetDocument,
} from 'src/domain/asset-lifecycle/asset-document';
import {
  ASSET_REPOSITORY,
  type IAssetRepository,
} from 'src/modules/asset/domain';
import { UploadAssetDocumentCommand } from '../upload-asset-document.command';

@Injectable()
export class UploadAssetDocumentHandler {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(ASSET_DOCUMENT_REPOSITORY)
    private readonly documentRepo: IAssetDocumentRepository,
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepo: IAssetRepository,
  ) {}

  async execute(cmd: UploadAssetDocumentCommand): Promise<AssetDocument> {
    const asset = await this.assetRepo.findById(cmd.assetId);
    if (!asset) {
      throw new UseCaseException(
        `Asset with id ${cmd.assetId} not found`,
        UploadAssetDocumentCommand.name,
      );
    }

    const id = this.idGenerator.generate();
    const document = AssetDocument.builder(
      id,
      cmd.assetId,
      cmd.organizationId,
      cmd.documentName,
      cmd.filePath,
      cmd.fileType,
      cmd.uploadedByUserId,
    )
      .ofType(cmd.documentType)
      .withDescription(cmd.description)
      .build();

    return await this.documentRepo.save(document);
  }
}
