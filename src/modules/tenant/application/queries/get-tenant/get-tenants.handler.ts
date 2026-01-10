import { Inject } from '@nestjs/common';
import {
  TENANT_REPOSITORY,
  type ITenantRepository,
  Tenant,
} from '../../../domain';
import { GetTenantsQuery } from './get-tenants.query';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetTenantsResult {
  constructor(
    public readonly total: number,
    public readonly data: Tenant[],
  ) {}
}

@QueryHandler(GetTenantsQuery)
export class GetTenantsHandler implements IQueryHandler<
  GetTenantsQuery,
  GetTenantsResult
> {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepo: ITenantRepository,
  ) {}

  async execute(query: GetTenantsQuery): Promise<GetTenantsResult> {
    const result = await this.tenantRepo.find(
      query.status,
      query.includeDeleted,
    );
    return new GetTenantsResult(result.total, result.data);
  }
}
