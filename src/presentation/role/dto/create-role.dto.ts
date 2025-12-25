import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  organizationId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionIds?: string[];
}
