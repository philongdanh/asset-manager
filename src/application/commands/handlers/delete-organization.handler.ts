import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions/use-case.exception';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from 'src/domain/identity/organization';
import { DeleteOrganizationCommand } from '../delete-organization.command';

@Injectable()
export class DeleteOrganizationHandler {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(command: DeleteOrganizationCommand): Promise<void> {
    const organization = await this.organizationRepository.findById(
      command.organizationId,
    );
    if (!organization) {
      throw new UseCaseException(
        `Organization with ID ${command.organizationId} not found`,
        DeleteOrganizationCommand.name,
      );
    }

    // Already deleted
    if (organization.isDeleted()) {
      return;
    }

    try {
      organization.markAsDeleted();
      await this.organizationRepository.update(organization);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to delete organization',
        DeleteOrganizationCommand.name,
      );
    }
  }
}
