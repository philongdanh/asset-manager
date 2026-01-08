import { Injectable, Inject } from '@nestjs/common';
import {
  ASSET_TRANSFER_REPOSITORY,
  type IAssetTransferRepository,
} from '../../../domain';
import { GetAssetTransfersQuery } from './get-asset-transfers.query';
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
import { USER_REPOSITORY, type IUserRepository } from '../../../../user/domain';
import { AssetTransferResult } from '../../dtos/asset-transfer.result';

@Injectable()
export class GetAssetTransfersHandler {
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
    query: GetAssetTransfersQuery,
  ): Promise<{ data: AssetTransferResult[]; total: number }> {
    const { data: transfers, total } = await this.transferRepo.findAll(
      query.organizationId,
      query.options,
    );

    const enrichedData = await Promise.all(
      transfers.map(async (transfer) => {
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
          transfer.fromUserId
            ? this.userRepo.findById(transfer.fromUserId)
            : null,
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
      }),
    );

    return { data: enrichedData, total };
  }
}
