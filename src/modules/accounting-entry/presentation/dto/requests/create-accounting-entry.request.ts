import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    IsDateString,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import {
    AccountingEntryType,
    ReferenceType,
} from '../../../domain';

export class CreateAccountingEntryRequest {
    @Expose({ name: 'organization_id' })
    @IsNotEmpty()
    @IsUUID('4')
    organizationId: string;

    @Expose({ name: 'entry_type' })
    @IsNotEmpty()
    @IsEnum(AccountingEntryType)
    entryType: AccountingEntryType;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    amount: number;

    @Expose({ name: 'entry_date' })
    @IsOptional()
    @IsDateString()
    entryDate?: Date;

    @Expose()
    @IsOptional()
    @IsString()
    description?: string;

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
}
