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
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(query: GetOrganizationsQuery) {
    return await this.organizationRepository.findAll(query.options);
  }
}
