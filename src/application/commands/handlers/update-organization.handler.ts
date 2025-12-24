import { Injectable, Inject } from '@nestjs/common';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
  OrganizationStatus,
} from 'src/domain/identity/organization';
import { UpdateOrganizationCommand } from '../update-organization.command';
import { UseCaseException } from 'src/application/core/exceptions/use-case.exception';

@Injectable()
export class UpdateOrganizationHandler {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(command: UpdateOrganizationCommand): Promise<void> {
    const organization = await this.organizationRepository.findById(
      command.organizationId,
    );
    if (!organization) {
      throw new UseCaseException(
        `Organization with ID ${command.organizationId} not found`,
        UpdateOrganizationCommand.name,
      );
    }

    // Only update if organization is not deleted
    if (organization.status === OrganizationStatus.DELETED) {
      throw new Error('Cannot update a deleted organization');
    }

    // Update fields
    if (command.orgName) {
      organization.updateName(command.orgName);
    }

    if (command.taxCode !== undefined) {
      // Check if tax code is unique
      if (command.taxCode) {
        const existingOrg = await this.organizationRepository.findByTaxCode(
          command.taxCode,
        );
        if (existingOrg && existingOrg.id !== command.organizationId) {
          throw new Error(
            `Tax code ${command.taxCode} already in use by another organization`,
          );
        }
      }
      organization.updateTaxCode(command.taxCode);
    }

    if (command.address !== undefined) {
      organization.updateAddress(command.address);
    }

    await this.organizationRepository.update(organization);
  }
}
