import { Expose } from 'class-transformer';
import {
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
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
  @IsDecimal()
  @IsNotEmpty()
  purchasePrice: number;

  @Expose({ name: 'original_cost' })
  @IsDecimal()
  @IsNotEmpty()
  originalCost: number;

  @Expose({ name: 'current_value' })
  @IsDecimal()
  @IsNotEmpty()
  currentValue: number;

  @Expose({ name: 'purchase_date' })
  @IsOptional()
  purchaseDate: Date | null;

  @Expose({ name: 'warranty_expiry_date' })
  @IsOptional()
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
  @IsString()
  @IsOptional()
  specifications: string | null;

  @Expose()
  @Expose()
  @IsEnum(AssetStatus)
  @IsOptional()
  status: AssetStatus | null;

  @Expose({ name: 'image_url' })
  @IsString()
  @IsOptional()
  imageUrl: string | null;
}
