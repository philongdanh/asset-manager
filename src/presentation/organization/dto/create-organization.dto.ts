import { OrganizationStatus } from 'src/domain/organization';

export class CreateOrgDto {
  name: string;
  status: OrganizationStatus;
}
