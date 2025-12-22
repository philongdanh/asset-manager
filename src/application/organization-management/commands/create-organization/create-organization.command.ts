import { OrganizationStatus } from 'src/domain/modules/organization';

export class CreateOrganizationCommand {
  constructor(
    public readonly name: string,
    public readonly status: OrganizationStatus,
  ) {}
}
