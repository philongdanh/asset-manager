import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateInventoryCheckRequest {
  @Expose({ name: 'organization_id' })
  @IsOptional()
  @IsUUID('4')
  organizationId?: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Expose({ name: 'check_date' })
  @IsOptional()
  @IsString()
  inventoryDate?: string;

  @Expose()
  @IsOptional()
  @IsString()
  notes?: string;

  @Expose({ name: 'asset_ids' })
  @IsOptional()
  @IsString({ each: true })
  assetIds?: string[];
}
