import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsEmail,
  IsDateString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserStatus } from 'src/domain/identity/user';

export class GetUserDetailsResponse {
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  username: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @Expose()
  @IsDateString()
  createdAt: Date;

  @Expose()
  @IsDateString()
  updatedAt: Date;

  @Expose()
  @IsDateString()
  deletedAt: Date | null;
}
