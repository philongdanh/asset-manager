import { Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateRoleRequest {
  @Expose({ name: 'organization_id' })
  @IsNotEmpty()
  @IsUUID()
  organizationId: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Expose({ name: 'permission_ids' })
  @IsArray()
  @IsString({ each: true })
  permissionIds: string[];
}
