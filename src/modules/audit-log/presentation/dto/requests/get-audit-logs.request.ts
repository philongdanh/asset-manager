import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type, Expose } from 'class-transformer';

export class GetAuditLogsRequest {
  @Expose({ name: 'user_id' })
  @IsOptional()
  @IsUUID('4')
  userId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  action?: string;

  @Expose({ name: 'entity_type' })
  @IsOptional()
  @IsString()
  entityType?: string;

  @Expose({ name: 'start_date' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @Expose({ name: 'end_date' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number;
}
