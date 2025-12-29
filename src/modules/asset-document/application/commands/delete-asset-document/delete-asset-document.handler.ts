import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import {
  ASSET_DOCUMENT_REPOSITORY,
  type IAssetDocumentRepository,
} from '../../../domain';
import { DeleteAssetDocumentCommand } from './delete-asset-document.command';

@Injectable()
export class DeleteAssetDocumentHandler {
  constructor(
    @Inject(ASSET_DOCUMENT_REPOSITORY)
    private readonly documentRepo: IAssetDocumentRepository,
  ) {}

  async execute(cmd: DeleteAssetDocumentCommand): Promise<void> {
    const exists = await this.documentRepo.existsById(cmd.id);
    if (!exists) {
      throw new UseCaseException(
        `Asset document with id ${cmd.id} not found`,
        DeleteAssetDocumentCommand.name,
      );
    }

    await this.documentRepo.delete(cmd.id);
  }
}
