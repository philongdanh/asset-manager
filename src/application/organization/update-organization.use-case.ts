import { Injectable, Inject } from '@nestjs/common';
import { EntityNotFoundException } from 'src/domain/core';
import {
  Organization,
  ORGANIZATION_REPOSITORY,
  OrganizationStatus,
  type IOrganizationRepository,
} from 'src/domain/modules/organization';

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(
    organizationId: string,
    name?: string,
    status?: OrganizationStatus,
  ): Promise<Organization> {
    const organization =
      await this.organizationRepository.findById(organizationId);
    if (!organization) {
      throw new EntityNotFoundException(Organization.name, organizationId);
    }

    if (name) {
      organization.updateInfo(name);
    }
    if (status) {
      organization.updateStatus(status);
    }

    await this.organizationRepository.save(organization);
    return organization;
  }
}
