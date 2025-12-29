import { Expose, Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { AssetDisposalStatus, AssetDisposalType } from '../../../domain';

export class GetAssetDisposalsRequest {
  @Expose()
  @IsEnum(AssetDisposalStatus)
  @IsOptional()
  status?: AssetDisposalStatus;

  @Expose({ name: 'disposal_type' })
  @IsEnum(AssetDisposalType)
  @IsOptional()
  disposalType?: AssetDisposalType;

  @Expose({ name: 'start_date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @Expose({ name: 'end_date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => value ?? 10)
  @IsOptional()
  limit?: number;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => value ?? 0)
  @IsOptional()
  offset?: number;
}
