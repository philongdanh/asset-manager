import { Injectable, Inject } from '@nestjs/common';
import { EntityNotFoundException } from 'src/domain/core';
import {
  Organization,
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from 'src/domain/identity/organization';
import { UpdateOrganizationCommand } from './update-organization.command';

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(command: UpdateOrganizationCommand): Promise<Organization> {
    const organization = await this.organizationRepository.findById(
      command.organizationId,
    );
    if (!organization) {
      throw new EntityNotFoundException(
        Organization.name,
        command.organizationId,
      );
    }

    if (command.organizationId) {
      organization.updateInfo(command.organizationId);
    }
    if (command.status) {
      organization.updateStatus(command.status);
    }
    await this.organizationRepository.save(organization);
    return organization;
  }
}
