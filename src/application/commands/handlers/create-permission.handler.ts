import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
  Permission,
} from 'src/domain/identity/permission';
import { CreatePermissionCommand } from '../create-permission.command';

@Injectable()
export class CreatePermissionHandler {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(command: CreatePermissionCommand): Promise<Permission> {
    // Validate unique constraint
    const existsByName = await this.permissionRepository.existsByName(
      command.name,
    );
    if (existsByName) {
      throw new UseCaseException(
        `Permission with name ${command.name} already exists`,
        CreatePermissionCommand.name,
      );
    }

    try {
      // Build permission entity
      const builder = Permission.builder(
        command.id,
        command.name,
      ).withDescription(command.description || null);

      const permission = builder.build();

      // Save to repository
      return await this.permissionRepository.save(permission);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to create permission',
        CreatePermissionCommand.name,
      );
    }
  }
}
