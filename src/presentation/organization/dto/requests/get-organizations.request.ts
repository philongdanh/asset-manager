import { Expose } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { OrganizationStatus } from 'src/domain/identity/organization';

export class GetOrganizationsRequest {
  @Expose()
  @IsOptional()
  @IsEnum(OrganizationStatus)
  status?: OrganizationStatus;

  @Expose()
  @IsOptional()
  @IsBoolean()
  includeDeleted?: boolean;
}
