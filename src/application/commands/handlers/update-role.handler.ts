import { Injectable, Inject } from '@nestjs/common';
import { UpdateRoleCommand } from 'src/application/commands/update-role.command';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  ROLE_REPOSITORY,
  type IRoleRepository,
} from 'src/domain/identity/role';

@Injectable()
export class UpdateRoleHandler {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: UpdateRoleCommand): Promise<void> {
    const role = await this.roleRepository.findById(command.roleId);

    if (!role) {
      throw new UseCaseException(
        `Role with ID ${command.roleId} not found`,
        UpdateRoleCommand.name,
      );
    }

    try {
      // Update fields
      if (command.roleName && command.roleName !== role.name) {
        // Check role name uniqueness
        const existsByName = await this.roleRepository.existsByName(
          role.organizationId,
          command.roleName,
        );
        if (existsByName) {
          throw new UseCaseException(
            `Role name ${command.roleName} already exists in this organization`,
            UpdateRoleCommand.name,
          );
        }
        role.rename(command.roleName);
      }

      if (
        command.organizationId &&
        command.organizationId !== role.organizationId
      ) {
        role.updateOrganization(command.organizationId);
      }

      await this.roleRepository.update(role);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to update role',
        UpdateRoleCommand.name,
      );
    }
  }
}
