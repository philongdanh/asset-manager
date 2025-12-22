import { Injectable, Inject } from '@nestjs/common';
import {
  Organization,
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from 'src/domain/modules/organization';
import { FindOrganizationQuery } from './find-organization.query';

@Injectable()
export class FindOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(query: FindOrganizationQuery): Promise<Organization | null> {
    return await this.organizationRepository.findById(query.organizationId);
  }
}
