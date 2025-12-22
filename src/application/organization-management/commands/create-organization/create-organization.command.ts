import { OrganizationStatus } from 'src/domain/identity/organization';

export class CreateOrganizationCommand {
  constructor(
    public readonly name: string,
    public readonly status: OrganizationStatus,
  ) {}
}
