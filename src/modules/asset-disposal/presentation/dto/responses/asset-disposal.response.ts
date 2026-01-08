import { Exclude, Expose } from 'class-transformer';
import {
  AssetDisposal,
  AssetDisposalStatus,
  AssetDisposalType,
} from '../../../domain';
import type { AssetDisposalResult } from '../../../application/dtos/asset-disposal.result';

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

  @Expose()
  asset: any | null;

  @Expose()
  organization: any | null;

  @Expose({ name: 'approved_by_user' })
  approvedByUser: any | null;

  constructor(result: AssetDisposalResult) {
    const { disposal, asset, organization, approvedByUser } = result;

    this.id = disposal.id;
    this.assetId = disposal.assetId;
    this.organizationId = disposal.organizationId;
    this.disposalDate = disposal.disposalDate;
    this.disposalType = disposal.disposalType;
    this.disposalValue = disposal.disposalValue;
    this.reason = disposal.reason;
    this.approvedByUserId = disposal.approvedByUserId;
    this.status = disposal.status;
    this.accountingEntryId = disposal.accountingEntryId;
    this.createdAt = disposal.createdAt!;
    this.updatedAt = disposal.updatedAt!;

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

    this.approvedByUser = approvedByUser
      ? {
          id: approvedByUser.id,
          username: approvedByUser.username,
          email: approvedByUser.email,
        }
      : null;
  }
}
