import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationDto } from './create-organization.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}
