import { Type } from 'class-transformer';
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
import { AssetCondition, AssetStatus } from 'src/domain/asset-lifecycle/asset';

export class UpdateAssetRequest {
    @IsString()
    @IsNotEmpty()
    assetName: string;

    @IsUUID('4')
    @IsNotEmpty()
    categoryId: string;

    @IsString()
    @IsOptional()
    model: string | null;

    @IsString()
    @IsOptional()
    serialNumber: string | null;

    @IsString()
    @IsOptional()
    manufacturer: string | null;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    purchasePrice: number;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    originalCost: number;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    currentValue: number;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    purchaseDate: Date | null;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    warrantyExpiryDate: Date | null;

    @IsEnum(AssetCondition)
    @IsOptional()
    condition: AssetCondition | null;

    @IsString()
    @IsOptional()
    location: string | null;

    @IsString()
    @IsOptional()
    specifications: string | null;

    @IsEnum(AssetStatus)
    @IsNotEmpty()
    status: AssetStatus;
}
