import { Expose, Exclude } from 'class-transformer';
import {
  AccountingEntry,
  AccountingEntryType,
  ReferenceType,
} from '../../../domain';

@Exclude()
export class AccountingEntryResponse {
  @Expose()
  id: string;

  @Expose({ name: 'organization_id' })
  organizationId: string;

  @Expose({ name: 'entry_type' })
  entryType: AccountingEntryType;

  @Expose({ name: 'entry_date' })
  entryDate: Date;

  @Expose()
  amount: number;

  @Expose()
  description: string | null;

  @Expose({ name: 'asset_id' })
  assetId: string | null;

  @Expose({ name: 'reference_id' })
  referenceId: string | null;

  @Expose({ name: 'reference_type' })
  referenceType: ReferenceType | null;

  @Expose({ name: 'created_by_user_id' })
  createdByUserId: string;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  constructor(entity: AccountingEntry) {
    this.id = entity.id;
    this.organizationId = entity.organizationId;
    this.entryType = entity.entryType;
    this.entryDate = entity.entryDate;
    this.amount = entity.amount;
    this.description = entity.description;
    this.assetId = entity.assetId;
    this.referenceId = entity.referenceId;
    this.referenceType = entity.referenceType;
    this.createdByUserId = entity.createdByUserId;
    this.createdAt = entity.createdAt!;
    this.updatedAt = entity.updatedAt!;
  }
}
