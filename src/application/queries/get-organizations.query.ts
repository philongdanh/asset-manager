import { OrganizationStatus } from 'src/domain/identity/organization';

export class GetOrganizationsQuery {
  constructor(
    public readonly options?: {
      status?: OrganizationStatus;
      includeDeleted?: boolean;
    },
  ) {}
}
