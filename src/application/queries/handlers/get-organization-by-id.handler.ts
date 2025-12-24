import { Injectable, Inject } from '@nestjs/common';
import { Organization } from 'generated/prisma/browser';
import { UseCaseException } from 'src/application/core/exceptions/use-case.exception';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from 'src/domain/identity/organization';
import { GetOrganizationByIdQuery } from '../get-organization-by-id.query';

@Injectable()
export class GetOrganizationByIdHandler {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(query: GetOrganizationByIdQuery): Promise<Organization> {
    const organization = await this.organizationRepository.findById(
      query.organizationId,
    );

    if (!organization) {
      throw new UseCaseException(
        `Organization with ID ${query.organizationId} not found`,
        GetOrganizationByIdQuery.name,
      );
    }

    return organization;
  }
}
