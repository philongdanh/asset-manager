import { Expose, Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';
import {
  MaintenanceStatus,
  MaintenanceType,
} from 'src/domain/maintenance/maintenance-schedule';

export class GetMaintenanceSchedulesRequest {
  @Expose({ name: 'asset_id' })
  @IsUUID('4')
  @IsOptional()
  assetId?: string;

  @Expose()
  @IsEnum(MaintenanceStatus)
  @IsOptional()
  status?: MaintenanceStatus;

  @Expose({ name: 'maintenance_type' })
  @IsEnum(MaintenanceType)
  @IsOptional()
  maintenanceType?: MaintenanceType;

  @Expose({ name: 'start_date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @Expose({ name: 'end_date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => value ?? 10)
  @IsOptional()
  limit?: number;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => value ?? 0)
  @IsOptional()
  offset?: number;
}
