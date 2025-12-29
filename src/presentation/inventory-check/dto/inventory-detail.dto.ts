import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class InventoryDetailDto {
  @IsNotEmpty()
  @IsUUID()
  assetId: string;

  @IsNotEmpty()
  @IsBoolean()
  isFound: boolean;

  @IsNotEmpty()
  @IsString()
  actualStatus: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
