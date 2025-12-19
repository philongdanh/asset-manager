import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAssetCategoryDto {
  @IsNotEmpty()
  @IsUUID()
  orgId: string;

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
