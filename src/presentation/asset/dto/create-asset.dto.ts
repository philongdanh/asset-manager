import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAssetDto {
  @IsNotEmpty()
  @IsUUID()
  organizationId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
