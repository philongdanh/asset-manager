import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { UserStatus } from '../../../domain';

export class CreateUserRequest {
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  organizationId: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  username: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  password: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose()
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @Expose()
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @Expose({ name: 'avatar_url' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
