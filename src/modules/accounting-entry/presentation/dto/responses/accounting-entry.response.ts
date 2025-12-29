import { Expose, Exclude } from 'class-transformer';
import {
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

    constructor(partial: Partial<AccountingEntryResponse>) {
        Object.assign(this, partial);
    }
}
