import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  ROLE_REPOSITORY,
  type IRoleRepository,
} from 'src/domain/identity/role';
import { UpdateRolePermissionsCommand } from '../update-role-permissions.command';

@Injectable()
export class UpdateRolePermissionsHandler {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: UpdateRolePermissionsCommand): Promise<void> {
    const role = await this.roleRepository.findById(command.roleId);

    if (!role) {
      throw new UseCaseException(
        `Role with ID ${command.roleId} not found`,
        UpdateRolePermissionsCommand.name,
      );
    }

    // Check if it's a system role (cannot modify permissions)
    if (role.isSystemRole()) {
      throw new UseCaseException(
        'Cannot modify permissions of system roles',
        UpdateRolePermissionsCommand.name,
      );
    }

    try {
      await this.roleRepository.updatePermissions(
        command.roleId,
        command.permissionIds,
      );
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to update role permissions',
        UpdateRolePermissionsCommand.name,
      );
    }
  }
}
