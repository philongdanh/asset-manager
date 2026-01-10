import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationRequest } from './create-tenant.request';

export class UpdateOrganizationRequest extends PartialType(
  CreateOrganizationRequest,
) {}
