import { Inject } from '@nestjs/common';
import {
  TENANT_REPOSITORY,
  type ITenantRepository,
  Tenant,
} from '../../../domain';
import { GetTenantDetailsQuery } from './get-tenant-details.query';
import { UseCaseException } from 'src/shared/application/exceptions';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetTenantDetailsQuery)
export class GetTenantDetailsHandler implements IQueryHandler<GetTenantDetailsQuery> {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly orgRepo: ITenantRepository,
  ) {}

  async execute(query: GetTenantDetailsQuery): Promise<Tenant> {
    const org = await this.orgRepo.findById(query.tenantId);
    if (!org)
      throw new UseCaseException(
        `Tenant with id ${query.tenantId} not found`,
        GetTenantDetailsHandler.name,
      );
    return org;
  }
}
