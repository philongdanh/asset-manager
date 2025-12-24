import { Injectable, Inject } from '@nestjs/common';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from 'src/domain/identity/organization';
import { GetOrganizationsSummaryQuery } from '../get-organizations-summary.query';

@Injectable()
export class GetOrganizationsSummaryHandler {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(query: GetOrganizationsSummaryQuery) {
    console.log(GetOrganizationsSummaryHandler.name, query);
    return await this.organizationRepository.getOrganizationsSummary();
  }
}
