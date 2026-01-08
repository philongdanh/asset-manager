import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Expose } from 'class-transformer';

export class GetInventoryChecksRequest {
  @Expose({ name: 'organization_id' })
  @IsOptional()
  @IsString()
  organizationId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  status?: string;

  @Expose({ name: 'start_date' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @Expose({ name: 'end_date' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Expose()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number;

  @Expose({ name: 'asset_ids' })
  @IsOptional()
  @IsString({ each: true })
  assetIds?: string[];
}
