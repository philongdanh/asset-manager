import { Injectable, Inject } from '@nestjs/common';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from 'src/domain/identity/organization';
import { GetOrganizationByIdQuery } from '../get-organization-by-id.query';
import { UseCaseException } from 'src/application/core/exceptions';

@Injectable()
export class GetOrganizationDetails {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepo: IOrganizationRepository,
  ) {}

  async execute(query: GetOrganizationByIdQuery) {
    const org = await this.orgRepo.findById(query.organizationId);
    if (!org)
      throw new UseCaseException(
        `Oranization with id ${query.organizationId} not found`,
        GetOrganizationDetails.name,
      );
    return org;
  }
}
