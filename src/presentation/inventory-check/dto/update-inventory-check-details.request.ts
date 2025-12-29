import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { InventoryDetailDto } from './inventory-detail.dto';

export class UpdateInventoryCheckDetailsRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InventoryDetailDto)
  details: InventoryDetailDto[];
}
