import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAssetCategoryDto {
  @IsNotEmpty()
  @IsUUID()
  organizationId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}
