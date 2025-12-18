import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsUUID()
  organizationId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  parentId: string | null;
}
