import { Expose } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateRoleRequest {
  @Expose()
  @IsOptional()
  @IsString()
  name?: string;

  @Expose({ name: 'permission_ids' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionIds?: string[];
}
