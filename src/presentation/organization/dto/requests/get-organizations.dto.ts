import { Expose } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { OrganizationStatus } from 'src/domain/identity/organization';

export class GetOrganizationsRequest {
  @Expose({ name: 'status' })
  @IsOptional()
  @IsEnum(OrganizationStatus)
  status?: OrganizationStatus;

  @Expose({ name: 'include_deleted' })
  @IsOptional()
  @IsBoolean()
  includeDeleted?: boolean;
}
