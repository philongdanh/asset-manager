import { Exclude, Expose } from 'class-transformer';
import {
  AssetTransfer,
  AssetTransferStatus,
  AssetTransferType,
} from '../../../domain';

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

  constructor(entity: AssetTransfer) {
    this.id = entity.id;
    this.assetId = entity.assetId;
    this.organizationId = entity.organizationId;
    this.transferDate = entity.transferDate;
    this.transferType = entity.transferType;
    this.fromDepartmentId = entity.fromDepartmentId;
    this.toDepartmentId = entity.toDepartmentId;
    this.fromUserId = entity.fromUserId;
    this.toUserId = entity.toUserId;
    this.approvedByUserId = entity.approvedByUserId;
    this.reason = entity.reason;
    this.status = entity.status;
    this.createdAt = entity.createdAt!;
    this.updatedAt = entity.updatedAt!;
  }
}
