import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteOrganizationCommand } from './delete-organization.command';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from '../../../domain';

@CommandHandler(DeleteOrganizationCommand)
export class DeleteOrganizationHandler implements ICommandHandler<DeleteOrganizationCommand> {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(command: DeleteOrganizationCommand): Promise<void> {
    const exists = await this.organizationRepository.existsById(
      command.organizationId,
    );
    if (!exists) {
      throw new NotFoundException(
        `Organization with ID ${command.organizationId} not found`,
      );
    }

    await this.organizationRepository.delete([command.organizationId]);
  }
}
