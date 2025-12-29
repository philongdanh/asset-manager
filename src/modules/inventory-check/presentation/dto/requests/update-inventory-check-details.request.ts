import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Expose } from 'class-transformer';

export class InventoryDetailDto {
  @Expose({ name: 'asset_id' })
  @IsUUID('4')
  assetId: string;

  @Expose({ name: 'is_found' })
  @IsBoolean()
  isFound: boolean;

  @Expose({ name: 'actual_status' })
  @IsString()
  actualStatus: string;

  @Expose()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateInventoryCheckDetailsRequest {
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InventoryDetailDto)
  details: InventoryDetailDto[];
}
