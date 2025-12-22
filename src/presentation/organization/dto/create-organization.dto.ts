import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrganizationStatus } from 'src/domain/identity/organization';

export class CreateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(OrganizationStatus)
  status: OrganizationStatus;
}
