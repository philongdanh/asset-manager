import { Expose } from 'class-transformer';
import { IsNotEmpty, ValidateIf, IsString } from 'class-validator';

export class SignInDto {
  @Expose({ name: 'organization_id' })
  @ValidateIf((_, value) => value !== null)
  @IsString()
  organizationId: string | null;

  @Expose()
  @IsNotEmpty()
  @IsString()
  username: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  password: string;
}
