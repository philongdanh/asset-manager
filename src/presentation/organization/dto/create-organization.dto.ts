import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  Matches,
  IsUrl,
} from 'class-validator';
import { OrganizationStatus } from 'src/domain/identity/organization';

export class CreateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  taxCode: string;

  @IsOptional()
  @IsEnum(OrganizationStatus)
  status: OrganizationStatus = OrganizationStatus.ACTIVE;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9+\-\s()]+$/, { message: 'Invalid phone number format' })
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUrl({
    require_protocol: true,
    require_valid_protocol: true,
    protocols: ['http', 'https'],
  })
  website?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
