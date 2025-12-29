import { OrganizationStatus } from 'src/modules/organization/domain';

export class GetOrganizationsQuery {
  constructor(
    public readonly status?: OrganizationStatus,
    public readonly includeDeleted?: boolean,
  ) {}
}
