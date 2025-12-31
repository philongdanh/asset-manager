import { Expose } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';

export class GetRolesRequest {
  @Expose({ name: 'organization_id' })
  @IsOptional()
  @IsUUID()
  organizationId?: string;
}
