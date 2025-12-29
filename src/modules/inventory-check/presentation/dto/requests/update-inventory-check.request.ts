import { IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class UpdateInventoryCheckRequest {
  @Expose()
  @IsOptional()
  @IsString()
  notes?: string;

  @Expose()
  @IsOptional()
  @IsString()
  status?: string;

  @Expose({ name: 'inventory_date' })
  @IsOptional()
  @IsString()
  inventoryDate?: string;
}
