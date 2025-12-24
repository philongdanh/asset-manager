import { OrganizationStatus } from 'src/domain/identity/organization';

export class GetOrganizationsQuery {
  constructor(
    public readonly options?: {
      status?: OrganizationStatus;
      limit?: number;
      offset?: number;
      search?: string;
      includeDeleted?: boolean;
    },
  ) {}
}
