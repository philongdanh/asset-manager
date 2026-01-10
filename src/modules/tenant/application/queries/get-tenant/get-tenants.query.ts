import { TenantStatus } from 'src/modules/tenant';

export class GetTenantsQuery {
  constructor(
    public readonly status?: TenantStatus,
    public readonly includeDeleted?: boolean,
  ) {}
}
