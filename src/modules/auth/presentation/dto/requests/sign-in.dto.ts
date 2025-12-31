import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignInDto {
  @Expose({ name: 'organization_id' })
  @IsOptional()
  @IsString()
  organizationId?: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  username: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  password: string;
}
