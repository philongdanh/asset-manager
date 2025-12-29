import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateInventoryCheckRequest {
    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsDateString()
    inventoryDate?: Date;
}
