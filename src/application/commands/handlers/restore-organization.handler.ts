import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions/use-case.exception';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from 'src/domain/identity/organization';
import { RestoreOrganizationCommand } from '../restore-organization.command';

@Injectable()
export class RestoreOrganizationHandler {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(command: RestoreOrganizationCommand): Promise<void> {
    const organization = await this.organizationRepository.findById(
      command.organizationId,
    );

    if (!organization) {
      throw new UseCaseException(
        `Organization with ID ${command.organizationId} not found`,
        RestoreOrganizationCommand.name,
      );
    }

    // Only restore if currently deleted
    if (!organization.isDeleted()) {
      throw new UseCaseException(
        'Only deleted organizations can be restored',
        RestoreOrganizationCommand.name,
      );
    }

    try {
      organization.restore();
      await this.organizationRepository.update(organization);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to restore organization',
        RestoreOrganizationCommand.name,
      );
    }
  }
}
