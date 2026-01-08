import { Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleRequest {
  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Expose({ name: 'permission_ids' })
  @IsArray()
  @IsString({ each: true })
  permissionIds: string[];
}
