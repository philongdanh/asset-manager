import { Injectable, Inject } from '@nestjs/common';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
  Organization,
} from '../../../domain';
import { GetOrganizationDetailsQuery } from './get-organization-details.query';
import { UseCaseException } from 'src/shared/application/exceptions';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetOrganizationDetailsQuery)
export class GetOrganizationDetailsHandler implements IQueryHandler<GetOrganizationDetailsQuery> {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepo: IOrganizationRepository,
  ) {}

  async execute(query: GetOrganizationDetailsQuery): Promise<Organization> {
    const org = await this.orgRepo.findById(query.organizationId);
    if (!org)
      throw new UseCaseException(
        `Organization with id ${query.organizationId} not found`,
        GetOrganizationDetailsHandler.name,
      );
    return org;
  }
}
