import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateInventoryCheckRequest {
  @Expose({ name: 'organization_id' })
  @IsUUID('4')
  organizationId: string;

  @Expose({ name: 'inventory_date' })
  @IsOptional()
  @IsString()
  inventoryDate?: string;

  @Expose()
  @IsOptional()
  @IsString()
  notes?: string;
}
