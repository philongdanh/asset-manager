import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CompleteMaintenanceRequest {
    @Expose()
    @IsString()
    @IsNotEmpty()
    result: string;

    @Expose({ name: 'actual_cost' })
    @IsNumber()
    @Min(0)
    @IsOptional()
    actualCost?: number | null;
}
