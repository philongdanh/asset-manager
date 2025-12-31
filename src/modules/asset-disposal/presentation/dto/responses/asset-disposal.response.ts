import { Exclude, Expose } from 'class-transformer';
import {
  AssetDisposal,
  AssetDisposalStatus,
  AssetDisposalType,
} from '../../../domain';

@Exclude()
export class AssetDisposalResponse {
  @Expose()
  id: string;

  @Expose({ name: 'asset_id' })
  assetId: string;

  @Expose({ name: 'organization_id' })
  organizationId: string;

  @Expose({ name: 'disposal_date' })
  disposalDate: Date;

  @Expose({ name: 'disposal_type' })
  disposalType: AssetDisposalType;

  @Expose({ name: 'disposal_value' })
  disposalValue: number;

  @Expose()
  reason: string | null;

  @Expose({ name: 'approved_by_user_id' })
  approvedByUserId: string | null;

  @Expose()
  status: AssetDisposalStatus;

  @Expose({ name: 'accounting_entry_id' })
  accountingEntryId: string | null;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  constructor(entity: AssetDisposal) {
    this.id = entity.id;
    this.assetId = entity.assetId;
    this.organizationId = entity.organizationId;
    this.disposalDate = entity.disposalDate;
    this.disposalType = entity.disposalType;
    this.disposalValue = entity.disposalValue;
    this.reason = entity.reason;
    this.approvedByUserId = entity.approvedByUserId;
    this.status = entity.status;
    this.accountingEntryId = entity.accountingEntryId;
    this.createdAt = entity.createdAt!;
    this.updatedAt = entity.updatedAt!;
  }
}
