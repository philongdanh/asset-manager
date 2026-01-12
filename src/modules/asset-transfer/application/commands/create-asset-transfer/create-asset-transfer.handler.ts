import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';
import {
  ASSET_TRANSFER_REPOSITORY,
  type IAssetTransferRepository,
  AssetTransfer,
} from '../../../domain';
import {
  ASSET_REPOSITORY,
  type IAssetRepository,
} from 'src/modules/asset/domain';
import { USER_REPOSITORY, type IUserRepository } from 'src/modules/user/domain';
import { CreateAssetTransferCommand } from './create-asset-transfer.command';

@Injectable()
export class CreateAssetTransferHandler {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(ASSET_TRANSFER_REPOSITORY)
    private readonly transferRepo: IAssetTransferRepository,
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepo: IAssetRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(cmd: CreateAssetTransferCommand): Promise<AssetTransfer> {
    const asset = await this.assetRepo.findById(cmd.assetId);
    if (!asset) {
      throw new UseCaseException(
        `Asset with id ${cmd.assetId} not found`,
        CreateAssetTransferCommand.name,
      );
    }
    const creator = await this.userRepo.findById(cmd.createdByUserId);

    // Prioritize explicit values from command, then asset current values, then creator values
    const fromUserId =
      cmd.fromUserId || asset.currentUserId || (creator ? creator.id : null);

    const fromDepartmentId =
      cmd.fromDepartmentId ||
      asset.currentDepartmentId ||
      (creator ? creator.departmentId : null);

    const id = this.idGenerator.generate();
    const transfer = AssetTransfer.builder(
      id,
      cmd.assetId,
      cmd.organizationId,
      cmd.transferType,
    )
      .onDate(cmd.transferDate)
      .fromDepartment(fromDepartmentId)
      .toDepartment(cmd.toDepartmentId)
      .fromUser(fromUserId)
      .toUser(cmd.toUserId)
      .withReason(cmd.reason)
      .build();

    return await this.transferRepo.save(transfer);
  }
}
