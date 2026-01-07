import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import {
  ASSET_TRANSFER_REPOSITORY,
  type IAssetTransferRepository,
  AssetTransfer,
} from '../../../domain';
import { GetAssetTransferDetailsQuery } from './get-asset-transfer-details.query';
import {
  ASSET_REPOSITORY,
  type IAssetRepository,
} from '../../../../asset/domain';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from '../../../../organization/domain';
import {
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from '../../../../department/domain';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../../../user/domain';
import { AssetTransferResult } from '../../dtos/asset-transfer.result';

@Injectable()
export class GetAssetTransferDetailsHandler {
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
  ) { }

  async execute(
    query: GetAssetTransferDetailsQuery,
  ): Promise<AssetTransferResult> {
    const transfer = await this.transferRepo.findById(query.transferId);
    if (!transfer) {
      throw new UseCaseException(
        `Transfer with id ${query.transferId} not found`,
        GetAssetTransferDetailsQuery.name,
      );
    }

    const [
      asset,
      organization,
      fromDepartment,
      toDepartment,
      fromUser,
      toUser,
      approvedByUser,
    ] = await Promise.all([
      this.assetRepo.findById(transfer.assetId),
      this.orgRepo.findById(transfer.organizationId),
      transfer.fromDepartmentId
        ? this.deptRepo.findById(transfer.fromDepartmentId)
        : null,
      transfer.toDepartmentId
        ? this.deptRepo.findById(transfer.toDepartmentId)
        : null,
      transfer.fromUserId ? this.userRepo.findById(transfer.fromUserId) : null,
      transfer.toUserId ? this.userRepo.findById(transfer.toUserId) : null,
      transfer.approvedByUserId
        ? this.userRepo.findById(transfer.approvedByUserId)
        : null,
    ]);

    return {
      transfer,
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
