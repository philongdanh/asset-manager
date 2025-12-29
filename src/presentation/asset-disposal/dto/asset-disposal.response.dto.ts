import { Exclude, Expose } from 'class-transformer';
import { AssetDisposalStatus, AssetDisposalType } from 'src/domain/asset-lifecycle/asset-disposal';

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

    constructor(partial: Partial<AssetDisposalResponse>) {
        Object.assign(this, partial);
    }
}
