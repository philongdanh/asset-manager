import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import { ID_GENERATOR, type IIdGenerator } from 'src/domain/core/interfaces';
import {
  ASSET_TRANSFER_REPOSITORY,
  type IAssetTransferRepository,
  AssetTransfer,
} from 'src/domain/asset-lifecycle/asset-transfer';
import {
  ASSET_REPOSITORY,
  type IAssetRepository,
} from 'src/modules/asset/domain';
import { CreateAssetTransferCommand } from '../create-asset-transfer.command';

@Injectable()
export class CreateAssetTransferHandler {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(ASSET_TRANSFER_REPOSITORY)
    private readonly transferRepo: IAssetTransferRepository,
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepo: IAssetRepository,
  ) {}

  async execute(cmd: CreateAssetTransferCommand): Promise<AssetTransfer> {
    const asset = await this.assetRepo.findById(cmd.assetId);
    if (!asset) {
      throw new UseCaseException(
        `Asset with id ${cmd.assetId} not found`,
        CreateAssetTransferCommand.name,
      );
    }

    // Check if asset is already in a pending transfer?
    const hasPending = await this.transferRepo.hasPendingTransfer(cmd.assetId);
    if (hasPending) {
      throw new UseCaseException(
        `Asset ${cmd.assetId} already has a pending transfer`,
        CreateAssetTransferCommand.name,
      );
    }

    const id = this.idGenerator.generate();
    const transfer = AssetTransfer.builder(
      id,
      cmd.assetId,
      cmd.organizationId,
      cmd.transferType,
    )
      .onDate(cmd.transferDate)
      .fromDepartment(cmd.fromDepartmentId)
      .toDepartment(cmd.toDepartmentId)
      .fromUser(cmd.fromUserId)
      .toUser(cmd.toUserId)
      .withReason(cmd.reason)
      .build();

    return await this.transferRepo.save(transfer);
  }
}
