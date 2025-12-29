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
import { AssetDisposalType } from 'src/domain/asset-lifecycle/asset-disposal';

export class CreateAssetDisposalRequest {
  @Expose({ name: 'organization_id' })
  @IsUUID('4')
  @IsNotEmpty()
  organizationId: string;

  @Expose({ name: 'asset_id' })
  @IsUUID('4')
  @IsNotEmpty()
  assetId: string;

  @Expose({ name: 'disposal_type' })
  @IsEnum(AssetDisposalType)
  @IsNotEmpty()
  disposalType: AssetDisposalType;

  @Expose({ name: 'disposal_date' })
  @IsDate()
  @Type(() => Date)
  disposalDate: Date;

  @Expose({ name: 'disposal_value' })
  @IsNumber()
  @Min(0)
  disposalValue: number;

  @Expose()
  @IsString()
  @IsOptional()
  reason?: string | null;
}
