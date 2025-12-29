import { Exclude, Expose } from 'class-transformer';
import { AssetCondition, AssetStatus } from 'src/domain/asset-lifecycle/asset';

@Exclude()
export class AssetResponse {
    @Expose()
    id: string;

    @Expose({ name: 'organization_id' })
    organizationId: string;

    @Expose({ name: 'asset_code' })
    assetCode: string;

    @Expose({ name: 'asset_name' })
    assetName: string;

    @Expose({ name: 'category_id' })
    categoryId: string;

    @Expose({ name: 'created_by_user_id' })
    createdByUserId: string;

    @Expose({ name: 'purchase_price' })
    purchasePrice: number;

    @Expose({ name: 'original_cost' })
    originalCost: number;

    @Expose({ name: 'current_value' })
    currentValue: number;

    @Expose()
    status: AssetStatus;

    @Expose({ name: 'current_department_id' })
    currentDepartmentId: string | null;

    @Expose({ name: 'current_user_id' })
    currentUserId: string | null;

    @Expose()
    model: string | null;

    @Expose({ name: 'serial_number' })
    serialNumber: string | null;

    @Expose()
    manufacturer: string | null;

    @Expose({ name: 'purchase_date' })
    purchaseDate: Date | null;

    @Expose({ name: 'warranty_expiry_date' })
    warrantyExpiryDate: Date | null;

    @Expose()
    location: string | null;

    @Expose()
    specifications: string | null;

    @Expose()
    condition: AssetCondition | null;

    @Expose({ name: 'created_at' })
    createdAt: Date;

    @Expose({ name: 'updated_at' })
    updatedAt: Date;

    constructor(partial: Partial<AssetResponse>) {
        Object.assign(this, partial);
    }
}
