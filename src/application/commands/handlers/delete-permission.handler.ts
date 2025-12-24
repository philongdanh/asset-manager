import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
} from 'src/domain/identity/permission';
import { DeletePermissionCommand } from '../delete-permission.command';

@Injectable()
export class DeletePermissionHandler {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(command: DeletePermissionCommand): Promise<void> {
    const permission = await this.permissionRepository.findById(
      command.permissionId,
    );

    if (!permission) {
      throw new UseCaseException(
        `Permission with ID ${command.permissionId} not found`,
        DeletePermissionCommand.name,
      );
    }

    // Check if it's a system permission (cannot delete)
    if (permission.isSystemPermission()) {
      throw new UseCaseException(
        'System permissions cannot be deleted',
        DeletePermissionCommand.name,
      );
    }

    try {
      await this.permissionRepository.delete(command.permissionId);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to delete permission',
        DeletePermissionCommand.name,
      );
    }
  }
}
