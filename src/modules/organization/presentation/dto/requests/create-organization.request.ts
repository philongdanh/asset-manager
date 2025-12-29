import { Expose } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsEmail,
    IsUrl,
} from 'class-validator';
import { OrganizationStatus } from '../../../domain';

export class CreateOrganizationRequest {
    @Expose()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Expose()
    @IsOptional()
    @IsEnum(OrganizationStatus)
    status: OrganizationStatus = OrganizationStatus.ACTIVE;

    @Expose()
    @IsOptional()
    @IsString()
    phone?: string;

    @Expose()
    @IsOptional()
    @IsEmail()
    email?: string;

    @Expose({ name: 'tax_code' })
    @IsOptional()
    @IsString()
    taxCode?: string;

    @Expose()
    @IsOptional()
    @IsUrl({
        require_protocol: true,
        require_valid_protocol: true,
        protocols: ['http', 'https'],
    })
    website?: string;

    @Expose()
    @IsOptional()
    @IsString()
    address?: string;
}
