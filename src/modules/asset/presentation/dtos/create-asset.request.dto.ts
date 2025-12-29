import { Expose, Type } from 'class-transformer';
import {
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';
import { AssetCondition, AssetStatus } from '../../domain/entities/asset.entity';

export class CreateAssetRequest {
    @Expose({ name: 'organization_id' })
    @IsUUID('4')
    @IsNotEmpty()
    organizationId: string;

    @Expose({ name: 'asset_code' })
    @IsString()
    @IsNotEmpty()
    assetCode: string;

    @Expose({ name: 'asset_name' })
    @IsString()
    @IsNotEmpty()
    assetName: string;

    @Expose({ name: 'category_id' })
    @IsUUID('4')
    @IsNotEmpty()
    categoryId: string;

    @Expose({ name: 'purchase_price' })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    purchasePrice: number;

    @Expose({ name: 'original_cost' })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    originalCost: number;

    @Expose({ name: 'current_value' })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    currentValue: number;

    @Expose()
    @IsString()
    @IsOptional()
    model: string | null;

    @Expose({ name: 'serial_number' })
    @IsString()
    @IsOptional()
    serialNumber: string | null;

    @Expose()
    @IsString()
    @IsOptional()
    manufacturer: string | null;

    @Expose({ name: 'purchase_date' })
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    purchaseDate: Date | null;

    @Expose({ name: 'warranty_expiry_date' })
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    warrantyExpiryDate: Date | null;

    @Expose()
    @IsString()
    @IsOptional()
    location: string | null;

    @Expose()
    @IsString()
    @IsOptional()
    specifications: string | null;

    @Expose()
    @IsEnum(AssetCondition)
    @IsOptional()
    condition: AssetCondition | null;

    @Expose()
    @IsEnum(AssetStatus)
    @IsOptional()
    status: AssetStatus | null;
}
