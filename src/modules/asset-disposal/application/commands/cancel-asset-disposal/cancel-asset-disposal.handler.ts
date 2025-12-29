import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  ASSET_DISPOSAL_REPOSITORY,
  type IAssetDisposalRepository,
  AssetDisposal,
} from '../../../domain';
import { CancelAssetDisposalCommand } from './cancel-asset-disposal.command';

@Injectable()
export class CancelAssetDisposalHandler {
  constructor(
    @Inject(ASSET_DISPOSAL_REPOSITORY)
    private readonly disposalRepo: IAssetDisposalRepository,
  ) {}

  async execute(cmd: CancelAssetDisposalCommand): Promise<AssetDisposal> {
    const disposal = await this.disposalRepo.findById(cmd.id);
    if (!disposal) {
      throw new UseCaseException(
        `Asset disposal with id ${cmd.id} not found`,
        CancelAssetDisposalCommand.name,
      );
    }

    disposal.cancel();
    return await this.disposalRepo.update(disposal);
  }
}
