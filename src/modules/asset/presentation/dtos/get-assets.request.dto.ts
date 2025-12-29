import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';
import { AssetStatus } from '../../domain/entities/asset.entity';

export class GetAssetsRequest {
    @IsEnum(AssetStatus)
    @IsOptional()
    status?: AssetStatus;

    @IsUUID('4')
    @IsOptional()
    categoryId?: string;

    @IsUUID('4')
    @IsOptional()
    departmentId?: string;

    @IsUUID('4')
    @IsOptional()
    userId?: string;

    @IsString()
    @IsOptional()
    search?: string;

    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    limit?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Type(() => Number)
    offset?: number;

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    includeDeleted?: boolean;
}
