import { Exclude, Expose } from 'class-transformer';
import {
  AssetTransfer,
  AssetTransferStatus,
  AssetTransferType,
} from '../../../domain';
import type { AssetTransferResult } from '../../../application/dtos/asset-transfer.result';

@Exclude()
export class AssetTransferResponse {
  @Expose()
  id: string;

  @Expose({ name: 'asset_id' })
  assetId: string;

  @Expose({ name: 'organization_id' })
  organizationId: string;

  @Expose({ name: 'transfer_date' })
  transferDate: Date;

  @Expose({ name: 'transfer_type' })
  transferType: AssetTransferType;

  @Expose({ name: 'from_department_id' })
  fromDepartmentId: string | null;

  @Expose({ name: 'to_department_id' })
  toDepartmentId: string | null;

  @Expose({ name: 'from_user_id' })
  fromUserId: string | null;

  @Expose({ name: 'to_user_id' })
  toUserId: string | null;

  @Expose({ name: 'approved_by_user_id' })
  approvedByUserId: string | null;

  @Expose()
  reason: string | null;

  @Expose()
  status: AssetTransferStatus;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  @Expose()
  asset: any | null; // Define proper interfaces if strict typing is needed

  @Expose()
  organization: any | null;

  @Expose({ name: 'from_department' })
  fromDepartment: any | null;

  @Expose({ name: 'to_department' })
  toDepartment: any | null;

  @Expose({ name: 'from_user' })
  fromUser: any | null;

  @Expose({ name: 'to_user' })
  toUser: any | null;

  @Expose({ name: 'approved_by_user' })
  approvedByUser: any | null;

  constructor(result: AssetTransferResult) {
    const {
      transfer,
      asset,
      organization,
      fromDepartment,
      toDepartment,
      fromUser,
      toUser,
      approvedByUser,
    } = result;

    this.id = transfer.id;
    this.assetId = transfer.assetId;
    this.organizationId = transfer.organizationId;
    this.transferDate = transfer.transferDate;
    this.transferType = transfer.transferType;
    this.fromDepartmentId = transfer.fromDepartmentId;
    this.toDepartmentId = transfer.toDepartmentId;
    this.fromUserId = transfer.fromUserId;
    this.toUserId = transfer.toUserId;
    this.approvedByUserId = transfer.approvedByUserId;
    this.reason = transfer.reason;
    this.status = transfer.status;
    this.createdAt = transfer.createdAt!;
    this.updatedAt = transfer.updatedAt!;

    // Map nested objects
    this.asset = asset
      ? {
        id: asset.id,
        asset_code: asset.assetCode,
        asset_name: asset.assetName,
      }
      : null;

    this.organization = organization
      ? { id: organization.id, name: organization.name }
      : null;

    this.fromDepartment = fromDepartment
      ? { id: fromDepartment.id, name: fromDepartment.name }
      : null;

    this.toDepartment = toDepartment
      ? { id: toDepartment.id, name: toDepartment.name }
      : null;

    this.fromUser = fromUser
      ? {
        id: fromUser.id,
        username: fromUser.username,
        email: fromUser.email,
      }
      : null;

    this.toUser = toUser
      ? {
        id: toUser.id,
        username: toUser.username,
        email: toUser.email,
      }
      : null;

    this.approvedByUser = approvedByUser
      ? {
        id: approvedByUser.id,
        username: approvedByUser.username,
        email: approvedByUser.email,
      }
      : null;
  }
}
