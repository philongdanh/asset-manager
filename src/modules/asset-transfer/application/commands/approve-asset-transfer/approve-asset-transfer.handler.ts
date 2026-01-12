import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import {
  ASSET_TRANSFER_REPOSITORY,
  type IAssetTransferRepository,
} from '../../../domain';
import { ApproveAssetTransferCommand } from './approve-asset-transfer.command';
import { AssetTransferResult } from '../../dtos/asset-transfer.result';
import {
  ASSET_REPOSITORY,
  type IAssetRepository,
} from 'src/modules/asset/domain';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from 'src/modules/organization/domain';
import {
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/modules/department/domain';
import { USER_REPOSITORY, type IUserRepository } from 'src/modules/user/domain';

@Injectable()
export class ApproveAssetTransferHandler {
  constructor(
    @Inject(ASSET_TRANSFER_REPOSITORY)
    private readonly transferRepo: IAssetTransferRepository,
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepo: IAssetRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepo: IOrganizationRepository,
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly deptRepo: IDepartmentRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(
    cmd: ApproveAssetTransferCommand,
  ): Promise<AssetTransferResult> {
    const transfer = await this.transferRepo.findById(cmd.transferId);
    if (!transfer) {
      throw new UseCaseException(
        `Transfer with id ${cmd.transferId} not found`,
        ApproveAssetTransferCommand.name,
      );
    }

    transfer.approve(cmd.approvedByUserId);
    const updatedTransfer = await this.transferRepo.update(transfer);

    const [
      asset,
      organization,
      fromDepartment,
      toDepartment,
      fromUser,
      toUser,
      approvedByUser,
    ] = await Promise.all([
      this.assetRepo.findById(updatedTransfer.assetId).then(async (asset) => {
        if (asset) {
          asset.updateLocation(
            updatedTransfer.toDepartmentId,
            updatedTransfer.toUserId,
          );
          await this.assetRepo.update(asset);
          return asset;
        }
        return null;
      }),
      this.orgRepo.findById(updatedTransfer.organizationId),
      updatedTransfer.fromDepartmentId
        ? this.deptRepo.findById(updatedTransfer.fromDepartmentId)
        : null,
      updatedTransfer.toDepartmentId
        ? this.deptRepo.findById(updatedTransfer.toDepartmentId)
        : null,
      updatedTransfer.fromUserId
        ? this.userRepo.findById(updatedTransfer.fromUserId)
        : null,
      updatedTransfer.toUserId
        ? this.userRepo.findById(updatedTransfer.toUserId)
        : null,
      updatedTransfer.approvedByUserId
        ? this.userRepo.findById(updatedTransfer.approvedByUserId)
        : null,
    ]);

    return {
      transfer: updatedTransfer,
      asset,
      organization,
      fromDepartment,
      toDepartment,
      fromUser,
      toUser,
      approvedByUser,
    };
  }
}
