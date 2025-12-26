import { Injectable, Inject } from '@nestjs/common';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from 'src/domain/identity/organization';
import { GetOrganizationsQuery } from '../get-organizations.query';

@Injectable()
export class GetOrganizationsHandler {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepo: IOrganizationRepository,
  ) {}

  async execute(query: GetOrganizationsQuery) {
    return await this.orgRepo.find(query.status, query.includeDeleted);
  }
}
