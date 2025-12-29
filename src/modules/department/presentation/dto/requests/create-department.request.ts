import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDepartmentRequest {
  @Expose({ name: 'organization_id' })
  @IsNotEmpty()
  @IsUUID('4')
  organizationId: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Expose({ name: 'parent_id' })
  @IsOptional()
  @IsUUID('4')
  parentId: string | null;
}
