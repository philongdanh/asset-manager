import { Exclude, Expose } from 'class-transformer';
import { DepreciationMethod } from 'src/domain/finance-accounting/asset-depreciation';

@Exclude()
export class AssetDepreciationResponse {
    @Expose()
    id: string;

    @Expose({ name: 'asset_id' })
    assetId: string;

    @Expose({ name: 'organization_id' })
    organizationId: string;

    @Expose({ name: 'depreciation_date' })
    depreciationDate: Date;

    @Expose()
    method: DepreciationMethod;

    @Expose({ name: 'depreciation_value' })
    depreciationValue: number;

    @Expose({ name: 'accumulated_depreciation' })
    accumulatedDepreciation: number;

    @Expose({ name: 'remaining_value' })
    remainingValue: number;

    @Expose({ name: 'accounting_entry_id' })
    accountingEntryId: string | null;

    @Expose({ name: 'created_at' })
    createdAt: Date;

    @Expose({ name: 'updated_at' })
    updatedAt: Date;

    constructor(partial: Partial<AssetDepreciationResponse>) {
        Object.assign(this, partial);
    }
}
