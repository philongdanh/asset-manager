import { OrganizationStatus } from 'src/domain/modules/organization';

export class UpdateOrganizationCommand {
  constructor(
    public readonly organizationId: string,
    public readonly name?: string,
    public readonly status?: OrganizationStatus,
  ) {}
}
