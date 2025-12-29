import { Expose } from 'class-transformer';
import { AccountingEntryType, ReferenceType } from 'src/domain/finance-accounting/accounting-entry';

export class AccountingEntryResponse {
    @Expose()
    id: string;

    @Expose()
    organization_id: string;

    @Expose()
    entry_type: AccountingEntryType;

    @Expose()
    entry_date: Date;

    @Expose()
    amount: number;

    @Expose()
    description: string | null;

    @Expose()
    asset_id: string | null;

    @Expose()
    reference_id: string | null;

    @Expose()
    reference_type: ReferenceType | null;

    @Expose()
    created_by_user_id: string;

    @Expose()
    created_at: Date;

    @Expose()
    updated_at: Date;
}
