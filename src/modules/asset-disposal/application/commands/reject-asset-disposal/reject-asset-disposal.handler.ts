import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  ASSET_DISPOSAL_REPOSITORY,
  type IAssetDisposalRepository,
  AssetDisposal,
} from '../../../domain';
import { RejectAssetDisposalCommand } from './reject-asset-disposal.command';

@Injectable()
export class RejectAssetDisposalHandler {
  constructor(
    @Inject(ASSET_DISPOSAL_REPOSITORY)
    private readonly disposalRepo: IAssetDisposalRepository,
  ) {}

  async execute(cmd: RejectAssetDisposalCommand): Promise<AssetDisposal> {
    const disposal = await this.disposalRepo.findById(cmd.id);
    if (!disposal) {
      throw new UseCaseException(
        `Asset disposal with id ${cmd.id} not found`,
        RejectAssetDisposalCommand.name,
      );
    }

    disposal.reject(cmd.rejectedByUserId, cmd.reason);
    return await this.disposalRepo.update(disposal);
  }
}
