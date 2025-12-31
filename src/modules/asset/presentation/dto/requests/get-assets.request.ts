import { Type, Expose } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { AssetStatus } from '../../../domain/entities/asset.entity';

export class GetAssetsRequest {
  @IsEnum(AssetStatus)
  @IsOptional()
  status?: AssetStatus;

  @Expose({ name: 'category_id' })
  @IsUUID('4')
  @IsOptional()
  categoryId?: string;

  @Expose({ name: 'department_id' })
  @IsUUID('4')
  @IsOptional()
  departmentId?: string;

  @Expose({ name: 'user_id' })
  @IsUUID('4')
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  offset?: number;

  @Expose({ name: 'include_deleted' })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  includeDeleted?: boolean;
}
