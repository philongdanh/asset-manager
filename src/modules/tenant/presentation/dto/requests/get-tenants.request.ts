import { Expose } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { OrganizationStatus } from '../../../domain';

export class GetOrganizationsRequest {
  @Expose()
  @IsOptional()
  @IsEnum(OrganizationStatus)
  status?: OrganizationStatus;

  @Expose({ name: 'include_deleted' })
  @IsOptional()
  @IsBoolean()
  includeDeleted?: boolean;
}
