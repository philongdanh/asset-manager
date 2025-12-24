import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
} from 'src/domain/identity/permission';
import { UpdatePermissionCommand } from '../update-permission.command';

@Injectable()
export class UpdatePermissionHandler {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(command: UpdatePermissionCommand): Promise<void> {
    const permission = await this.permissionRepository.findById(
      command.permissionId,
    );

    if (!permission) {
      throw new UseCaseException(
        `Permission with ID ${command.permissionId} not found`,
        UpdatePermissionCommand.name,
      );
    }

    try {
      // Update fields
      if (command.name && command.name !== permission.name) {
        // Check permission name uniqueness
        const existsByName = await this.permissionRepository.existsByName(
          command.name,
        );
        if (existsByName) {
          throw new UseCaseException(
            `Permission name ${command.name} already exists`,
            UpdatePermissionCommand.name,
          );
        }
      }

      permission.updateInfo(command.name, command.description);
      await this.permissionRepository.update(permission);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to update permission',
        UpdatePermissionCommand.name,
      );
    }
  }
}
