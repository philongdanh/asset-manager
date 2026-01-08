import { IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class UpdateInventoryCheckRequest {
  @Expose()
  @IsOptional()
  @IsString()
  name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  status?: string;

  @Expose({ name: 'check_date' })
  @IsOptional()
  @IsString()
  inventoryDate?: string;
}
