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
  @Expose()
  @IsOptional()
  departmentId?: string;

  @Expose()
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @Expose()
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

  @Expose()
  @IsOptional()
  @IsBoolean()
  includeDeleted?: boolean;
}
