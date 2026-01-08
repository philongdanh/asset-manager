import { Expose } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

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
