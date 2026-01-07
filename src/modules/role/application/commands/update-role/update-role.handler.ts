import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRoleCommand } from './update-role.command';
import { ROLE_REPOSITORY, type IRoleRepository, Role } from '../../../domain';

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleHandler implements ICommandHandler<UpdateRoleCommand> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: UpdateRoleCommand): Promise<Role> {
    const role = await this.roleRepository.findById(
      command.roleId,
      command.organizationId,
    );
    if (!role) {
      throw new NotFoundException(`Role with ID ${command.roleId} not found`);
    }

    if (command.name !== undefined) {
      role.name = command.name;
    }

    if (command.permissionIds !== undefined) {
      // Get current permissions
      const currentPermissions = await this.roleRepository.getRolePermissions(
        command.roleId,
      );

      // Remove permissions that are no longer in the list
      const toRemove = currentPermissions.filter(
        (id) => !command.permissionIds!.includes(id),
      );
      if (toRemove.length > 0) {
        await this.roleRepository.removePermissions(command.roleId, toRemove);
      }

      // Add new permissions
      const toAdd = command.permissionIds.filter(
        (id) => !currentPermissions.includes(id),
      );
      if (toAdd.length > 0) {
        await this.roleRepository.assignPermissions(command.roleId, toAdd);
      }
    }

    return this.roleRepository.save(role);
  }
}
