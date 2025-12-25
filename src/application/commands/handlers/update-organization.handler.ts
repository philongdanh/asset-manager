import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from 'src/domain/identity/organization';
import { UpdateInfoOrgCommand } from '../update-organization.command';

@Injectable()
export class UpdateOrganizationHandler {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(command: UpdateInfoOrgCommand): Promise<void> {
    const organization = await this.organizationRepository.findById(
      command.organizationId,
    );
    if (!organization) {
      throw new UseCaseException(
        `Organization with ID ${command.organizationId} not found`,
        UpdateInfoOrgCommand.name,
      );
    }

    if (!organization.isActive()) {
      throw new UseCaseException(
        'Cannot update a inactive organization',
        UpdateInfoOrgCommand.name,
      );
    }

    organization.updateInfo(
      command.name,
      command.phone,
      command.email,
      command.website,
      command.address,
    );
    await this.organizationRepository.save(organization);
  }
}
