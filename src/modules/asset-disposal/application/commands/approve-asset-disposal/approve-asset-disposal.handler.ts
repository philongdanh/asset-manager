import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import {
  ASSET_DISPOSAL_REPOSITORY,
  type IAssetDisposalRepository,
  AssetDisposal,
} from '../../../domain';
import { ApproveAssetDisposalCommand } from './approve-asset-disposal.command';

@Injectable()
export class ApproveAssetDisposalHandler {
  constructor(
    @Inject(ASSET_DISPOSAL_REPOSITORY)
    private readonly disposalRepo: IAssetDisposalRepository,
  ) {}

  async execute(cmd: ApproveAssetDisposalCommand): Promise<AssetDisposal> {
    const disposal = await this.disposalRepo.findById(cmd.id);
    if (!disposal) {
      throw new UseCaseException(
        `Asset disposal with id ${cmd.id} not found`,
        ApproveAssetDisposalCommand.name,
      );
    }

    disposal.approve(cmd.approvedByUserId);
    return await this.disposalRepo.update(disposal);
  }
}
