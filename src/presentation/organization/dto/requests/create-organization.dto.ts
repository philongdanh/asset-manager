import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsUrl,
} from 'class-validator';
import { OrganizationStatus } from 'src/domain/identity/organization';

export class CreateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(OrganizationStatus)
  status: OrganizationStatus = OrganizationStatus.ACTIVE;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  taxCode?: string;

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
