import { Injectable, Inject } from '@nestjs/common';
import { AssignPermissionToRoleCommand } from 'src/application/commands/assign-permission-to-role.command';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  ROLE_REPOSITORY,
  type IRoleRepository,
} from 'src/domain/identity/role';

@Injectable()
export class AssignPermissionToRoleHandler {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: AssignPermissionToRoleCommand): Promise<void> {
    const role = await this.roleRepository.findById(command.roleId);

    if (!role) {
      throw new UseCaseException(
        `Role with ID ${command.roleId} not found`,
        AssignPermissionToRoleCommand.name,
      );
    }

    // Check if role already has this permission
    const hasPermission = await this.roleRepository.hasPermission(
      command.roleId,
      command.permissionId,
    );
    if (hasPermission) {
      return; // Already has the permission, no action needed
    }

    try {
      await this.roleRepository.assignPermission(
        command.roleId,
        command.permissionId,
      );
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to assign permission to role',
        AssignPermissionToRoleCommand.name,
      );
    }
  }
}
