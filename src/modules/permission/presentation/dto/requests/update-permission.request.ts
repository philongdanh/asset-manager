import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePermissionRequest {
  @Expose()
  @IsOptional()
  @IsString()
  name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  description?: string | null;
}
