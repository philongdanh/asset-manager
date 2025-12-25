import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
  OrganizationStatus,
} from 'src/domain/identity/organization';
import { ActivateOrganizationCommand } from '../activate-organization.command';

@Injectable()
export class ActivateOrganizationHandler {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(command: ActivateOrganizationCommand): Promise<void> {
    const organization = await this.organizationRepository.findById(
      command.organizationId,
    );
    if (!organization) {
      throw new UseCaseException(
        `Organization with ID ${command.organizationId} not found`,
        ActivateOrganizationCommand.name,
      );
    }

    // Cannot activate a deleted organization
    if (organization.status === OrganizationStatus.DELETED) {
      throw new UseCaseException(
        'Cannot activate a deleted organization',
        ActivateOrganizationCommand.name,
      );
    }

    try {
      organization.updateStatus();
      await this.organizationRepository.update(organization);
    } catch (err: any) {
      console.error(err);
      throw new UseCaseException(
        'Failed to activate organization',
        ActivateOrganizationCommand.name,
      );
    }
  }
}
