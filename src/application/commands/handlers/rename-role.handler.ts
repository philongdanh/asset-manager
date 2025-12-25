import { Injectable, Inject } from '@nestjs/common';
import { RenameRoleCommand } from 'src/application/commands/rename-role.command';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  ROLE_REPOSITORY,
  type IRoleRepository,
} from 'src/domain/identity/role';

@Injectable()
export class RenameRoleHandler {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: RenameRoleCommand): Promise<void> {
    const role = await this.roleRepository.findById(command.roleId);

    if (!role) {
      throw new UseCaseException(
        `Role with ID ${command.roleId} not found`,
        RenameRoleCommand.name,
      );
    }

    try {
      // Check role name uniqueness
      const existsByName = await this.roleRepository.existsByName(
        role.organizationId,
        command.roleName,
      );
      if (existsByName && role.name !== command.roleName) {
        throw new UseCaseException(
          `Role name ${command.roleName} already exists in this organization`,
          RenameRoleCommand.name,
        );
      }

      role.rename(command.roleName);
      await this.roleRepository.update(role);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to rename role',
        RenameRoleCommand.name,
      );
    }
  }
}
