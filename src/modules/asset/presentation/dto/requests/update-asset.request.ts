import { Expose, Type } from 'class-transformer';
import {
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsObject,
} from 'class-validator';
import {
  AssetCondition,
  AssetStatus,
} from '../../../domain/entities/asset.entity';

export class UpdateAssetRequest {
  @Expose({ name: 'asset_name' })
  @IsString()
  @IsNotEmpty()
  assetName: string;

  @Expose({ name: 'category_id' })
  @IsUUID('4')
  @IsNotEmpty()
  categoryId: string;

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

  @Expose({ name: 'purchase_price' })
  @IsNumber()
  @IsNotEmpty()
  purchasePrice: number;

  @Expose({ name: 'original_cost' })
  @IsNumber()
  @IsNotEmpty()
  originalCost: number;

  @Expose({ name: 'current_value' })
  @IsNumber()
  @IsNotEmpty()
  currentValue: number;

  @Expose({ name: 'purchase_date' })
  @IsOptional()
  @Type(() => Date)
  purchaseDate: Date | null;

  @Expose({ name: 'warranty_expiry_date' })
  @IsOptional()
  @Type(() => Date)
  warrantyExpiryDate: Date | null;

  @Expose()
  @IsEnum(AssetCondition)
  @IsOptional()
  condition: AssetCondition | null;

  @Expose()
  @IsString()
  @IsOptional()
  location: string | null;

  @Expose()
  @IsObject()
  @IsOptional()
  specifications: Record<string, any> | null;

  @Expose()
  @IsEnum(AssetStatus)
  @IsOptional()
  status: AssetStatus | null;

  @Expose({ name: 'image_url' })
  @IsString()
  @IsOptional()
  imageUrl: string | null;
}
