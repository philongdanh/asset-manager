import { Expose, Type } from 'class-transformer';
import {
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';
import { MaintenanceType } from 'src/domain/maintenance/maintenance-schedule';

export class CreateMaintenanceScheduleRequest {
    @Expose({ name: 'organization_id' })
    @IsUUID('4')
    @IsNotEmpty()
    organizationId: string;

    @Expose({ name: 'asset_id' })
    @IsUUID('4')
    @IsNotEmpty()
    assetId: string;

    @Expose({ name: 'maintenance_type' })
    @IsEnum(MaintenanceType)
    @IsNotEmpty()
    maintenanceType: MaintenanceType;

    @Expose({ name: 'scheduled_date' })
    @IsDate()
    @Type(() => Date)
    scheduledDate: Date;

    @Expose()
    @IsString()
    @IsOptional()
    description?: string | null;

    @Expose({ name: 'estimated_cost' })
    @IsNumber()
    @Min(0)
    @IsOptional()
    estimatedCost?: number | null;
}
