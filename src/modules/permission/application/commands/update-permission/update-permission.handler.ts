import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePermissionCommand } from './update-permission.command';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
  Permission,
} from '../../../domain';

@CommandHandler(UpdatePermissionCommand)
export class UpdatePermissionHandler implements ICommandHandler<UpdatePermissionCommand> {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(command: UpdatePermissionCommand): Promise<Permission> {
    const permission = await this.permissionRepository.findById(
      command.permissionId,
    );
    if (!permission) {
      throw new NotFoundException(
        `Permission with ID ${command.permissionId} not found`,
      );
    }

    permission.updateInfo(command.name, command.description);

    return this.permissionRepository.save(permission);
  }
}
