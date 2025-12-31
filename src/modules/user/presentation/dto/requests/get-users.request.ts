import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { UserStatus } from '../../../domain';

export class GetUsersRequest {
  @Expose({ name: 'department_id' })
  @IsOptional()
  departmentId?: string;

  @Expose()
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @Expose({ name: 'role_id' })
  @IsOptional()
  @IsUUID()
  roleId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  search?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  limit?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  offset?: number;

  @Expose({ name: 'include_deleted' })
  @IsOptional()
  @IsBoolean()
  includeDeleted?: boolean;
}
