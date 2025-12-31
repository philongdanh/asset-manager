import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePermissionCommand } from './delete-permission.command';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
} from '../../../domain';

@CommandHandler(DeletePermissionCommand)
export class DeletePermissionHandler implements ICommandHandler<DeletePermissionCommand> {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(command: DeletePermissionCommand): Promise<void> {
    const exists = await this.permissionRepository.existsById(
      command.permissionId,
    );
    if (!exists) {
      throw new NotFoundException(
        `Permission with ID ${command.permissionId} not found`,
      );
    }

    await this.permissionRepository.delete([command.permissionId]);
  }
}
