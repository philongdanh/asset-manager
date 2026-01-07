import { Injectable, Inject } from '@nestjs/common';

import {
  ASSET_REPOSITORY,
  type IAssetRepository,
} from '../../../domain/repositories/asset.repository.interface';
import { DeleteAssetCommand } from './delete-asset.command';
import { type IUserRepository, USER_REPOSITORY } from 'src/modules/user';
import { UseCaseException } from 'src/shared/application/exceptions';

@Injectable()
export class DeleteAssetHandler {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepo: IAssetRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) { }

  async execute(cmd: DeleteAssetCommand): Promise<void> {
    const actor = await this.userRepo.findById(cmd.actorId);
    if (!actor) {
      throw new UseCaseException(
        `User with id ${cmd.actorId} not found`,
        DeleteAssetCommand.name,
      );
    }

    if (actor.organizationId !== cmd.tenantId) {
      throw new UseCaseException(
        `User with id ${cmd.actorId} is not assigned to organization with id ${cmd.tenantId}`,
        DeleteAssetCommand.name,
      );
    }

    const asset = await this.assetRepo.findById(cmd.assetId);
    if (!asset) {
      throw new UseCaseException(
        `Asset with id ${cmd.assetId} not found`,
        DeleteAssetCommand.name,
      );
    }
    if (asset.organizationId !== cmd.tenantId) {
      throw new UseCaseException(
        `Asset with id ${cmd.assetId} is not assigned to organization with id ${cmd.tenantId}`,
        DeleteAssetCommand.name,
      );
    }

    await this.assetRepo.delete(cmd.assetId);
  }
}
