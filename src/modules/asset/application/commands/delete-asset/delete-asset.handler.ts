import { Injectable, Inject } from '@nestjs/common';

import {
  ASSET_REPOSITORY,
  type IAssetRepository,
} from '../../../domain/repositories/asset.repository.interface';
import { DeleteAssetCommand } from './delete-asset.command';

@Injectable()
export class DeleteAssetHandler {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepo: IAssetRepository,
  ) {}

  async execute(cmd: DeleteAssetCommand): Promise<void> {
    const asset = await this.assetRepo.findById(cmd.assetId);
    if (!asset) {
      return;
    }
    // Could add checks if asset is in use or has important history (but business rules might allow deletion or soft deletion handles it)
    await this.assetRepo.delete(cmd.assetId);
  }
}
