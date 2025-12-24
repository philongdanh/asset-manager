import { Injectable, Inject } from '@nestjs/common';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from 'src/domain/identity/organization';
import { GetRecentlyCreatedOrganizationsQuery } from '../get-recently-created-organizations.query';

@Injectable()
export class GetRecentlyCreatedOrganizationsHandler {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(query: GetRecentlyCreatedOrganizationsQuery) {
    return await this.organizationRepository.findRecentlyCreated(query.days);
  }
}
