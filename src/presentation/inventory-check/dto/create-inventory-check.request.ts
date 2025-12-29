import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class CreateInventoryCheckRequest {
  @IsNotEmpty()
  @IsUUID()
  organizationId: string;

  @IsOptional()
  @IsDateString()
  inventoryDate?: Date;

  @IsOptional()
  @IsString()
  notes?: string;
}
