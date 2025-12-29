import { IsEnum, IsInt, IsOptional, IsString, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { AuditAction, EntityType } from 'src/domain/inventory-audit/audit-log';

export class GetAuditLogsRequest {
    @IsOptional()
    @IsString()
    userId?: string;

    @IsOptional()
    @IsEnum(AuditAction)
    action?: AuditAction;

    @IsOptional()
    @IsEnum(EntityType)
    entityType?: EntityType;

    @IsOptional()
    @IsDateString()
    startDate?: Date;

    @IsOptional()
    @IsDateString()
    endDate?: Date;

    @IsOptional()
    @IsString()
    ipAddress?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    offset?: number;
}
