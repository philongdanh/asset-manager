import { Expose } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateDepartmentRequest {
  @Expose()
  @IsOptional()
  @IsString()
  name?: string;

  @Expose({ name: 'parent_id' })
  @IsOptional()
  @IsUUID()
  parentId?: string | null;
}
