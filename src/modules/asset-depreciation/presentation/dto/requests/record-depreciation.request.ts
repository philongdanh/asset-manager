import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Min,
} from 'class-validator';
import { DepreciationMethod } from '../../../domain';

export class RecordDepreciationRequest {
  @Expose({ name: 'organization_id' })
  @IsUUID('4')
  @IsNotEmpty()
  organizationId: string;

  @Expose({ name: 'asset_id' })
  @IsUUID('4')
  @IsNotEmpty()
  assetId: string;

  @Expose()
  @IsEnum(DepreciationMethod)
  @IsNotEmpty()
  method: DepreciationMethod;

  @Expose({ name: 'depreciation_date' })
  @IsDate()
  @Type(() => Date)
  depreciationDate: Date;

  @Expose({ name: 'depreciation_value' })
  @IsNumber()
  @Min(0)
  depreciationValue: number;

  @Expose({ name: 'accumulated_depreciation' })
  @IsNumber()
  @Min(0)
  accumulatedDepreciation: number;

  @Expose({ name: 'remaining_value' })
  @IsNumber()
  @Min(0)
  remainingValue: number;
}
