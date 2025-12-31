import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class GetDepartmentsRequest {
  @Expose({ name: 'organization_id' })
  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @Expose({ name: 'parent_id' })
  @IsOptional()
  @IsUUID()
  parentId?: string | null;

  @Expose({ name: 'include_deleted' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeDeleted?: boolean;
}
