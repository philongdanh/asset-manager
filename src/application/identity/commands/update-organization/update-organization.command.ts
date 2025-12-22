import { OrganizationStatus } from 'src/domain/identity/organization';

export class UpdateOrganizationCommand {
  constructor(
    public readonly organizationId: string,
    public readonly name?: string,
    public readonly status?: OrganizationStatus,
  ) {}
}
