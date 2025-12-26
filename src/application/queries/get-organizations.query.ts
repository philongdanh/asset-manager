import { OrganizationStatus } from 'src/domain/identity/organization';

export class GetOrganizationsQuery {
  constructor(
    public readonly status?: OrganizationStatus,
    public readonly includeDeleted?: boolean,
  ) {}
}
