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
  @Expose({ name: 'organization_id' })
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

  @Expose({ name: 'department_id' })
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

  @Expose({ name: 'full_name' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @Expose({ name: 'date_of_birth' })
  @IsOptional()
  dateOfBirth?: Date;

  @Expose()
  @IsOptional()
  @IsString()
  gender?: string;

  @Expose({ name: 'phone_number' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
