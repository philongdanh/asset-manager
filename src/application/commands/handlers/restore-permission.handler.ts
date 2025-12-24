import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
} from 'src/domain/identity/permission';
import { RestorePermissionCommand } from '../restore-permission.command';

@Injectable()
export class RestorePermissionHandler {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(command: RestorePermissionCommand): Promise<void> {
    const permission = await this.permissionRepository.findById(
      command.permissionId,
    );

    if (!permission) {
      throw new UseCaseException(
        `Permission with ID ${command.permissionId} not found`,
        RestorePermissionCommand.name,
      );
    }

    try {
      await this.permissionRepository.restore(command.permissionId);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to restore permission',
        RestorePermissionCommand.name,
      );
    }
  }
}
