import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    Min,
    IsDateString,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import {
    AccountingEntryType,
    ReferenceType,
} from '../../../domain';

export class GetAccountingEntriesRequest {
    @Expose({ name: 'entry_type' })
    @IsOptional()
    @IsEnum(AccountingEntryType)
    entryType?: AccountingEntryType;

    @Expose({ name: 'asset_id' })
    @IsOptional()
    @IsUUID('4')
    assetId?: string;

    @Expose({ name: 'reference_type' })
    @IsOptional()
    @IsEnum(ReferenceType)
    referenceType?: ReferenceType;

    @Expose({ name: 'reference_id' })
    @IsOptional()
    @IsString()
    referenceId?: string;

    @Expose({ name: 'created_by_user_id' })
    @IsOptional()
    @IsUUID('4')
    createdByUserId?: string;

    @Expose({ name: 'start_date' })
    @IsOptional()
    @IsDateString()
    startDate?: Date;

    @Expose({ name: 'end_date' })
    @IsOptional()
    @IsDateString()
    endDate?: Date;

    @Expose()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;

    @Expose()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    offset?: number;
}
