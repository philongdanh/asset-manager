import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsUUID()
  organizationId: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
