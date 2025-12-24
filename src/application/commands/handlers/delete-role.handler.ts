import { Injectable, Inject } from '@nestjs/common';
import { DeleteRoleCommand } from 'src/application/commands/delete-role.command';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  ROLE_REPOSITORY,
  type IRoleRepository,
} from 'src/domain/identity/role';

@Injectable()
export class DeleteRoleHandler {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: DeleteRoleCommand): Promise<void> {
    const role = await this.roleRepository.findById(command.roleId);

    if (!role) {
      throw new UseCaseException(
        `Role with ID ${command.roleId} not found`,
        DeleteRoleCommand.name,
      );
    }

    // Check if it's a system role (cannot delete)
    if (role.isSystemRole()) {
      throw new UseCaseException(
        'System roles cannot be deleted',
        DeleteRoleCommand.name,
      );
    }

    try {
      await this.roleRepository.delete(command.roleId);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to delete role',
        DeleteRoleCommand.name,
      );
    }
  }
}
