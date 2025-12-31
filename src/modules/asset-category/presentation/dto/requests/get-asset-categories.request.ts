import { Type, Expose } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class GetAssetCategoriesRequest {
  @Expose({ name: 'organization_id' })
  @IsUUID()
  @IsOptional()
  organizationId?: string;

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
