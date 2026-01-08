import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRoleCommand } from './update-role.command';
import { ROLE_REPOSITORY, type IRoleRepository, Role } from '../../../domain';
import { EntityNotFoundException } from 'src/shared/domain';
import {
  type IPermissionRepository,
  PERMISSION_REPOSITORY,
} from 'src/modules/permission';

export class UpdateRoleResult {
  constructor(
    public readonly tenantId: string,
    public readonly id: string,
    public readonly name: string,
    public readonly permissions: PermissionResponse[],
  ) {}
}

class PermissionResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
  ) {}
}

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleHandler implements ICommandHandler<
  UpdateRoleCommand,
  void
> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permRepo: IPermissionRepository,
  ) {}

  async execute(cmd: UpdateRoleCommand): Promise<void> {
    const role = await this.roleRepo.findById(cmd.id);
    if (!role) {
      throw new EntityNotFoundException(
        `Role with ID ${cmd.id} not found`,
        UpdateRoleCommand.name,
      );
    }

    if (cmd.name !== undefined) {
      role.name = cmd.name;
    }

    if (cmd.permissionIds !== undefined) {
      // Get current permissions
      const currentPermissions = await this.roleRepo.getRolePermissions(cmd.id);

      // Remove permissions that are no longer in the list
      const toRemove = currentPermissions.filter(
        (id) => !cmd.permissionIds!.includes(id),
      );
      if (toRemove.length > 0) {
        await this.roleRepo.removePermissions(cmd.id, toRemove);
      }

      // Add new permissions
      const toAdd = cmd.permissionIds.filter(
        (id) => !currentPermissions.includes(id),
      );
      if (toAdd.length > 0) {
        await this.roleRepo.assignPermissions(cmd.id, toAdd);
      }
    }

    const savedRole = await this.roleRepo.save(role);
    const permissions = await this.roleRepo.assignPermissions(
      cmd.id,
      cmd.permissionIds!,
    );
    // return new UpdateRoleResult(
    //   savedRole.tenantId,
    //   savedRole.id,
    //   savedRole.name,
    //   savedRole.permissions.map((permission) => new PermissionResponse(
    //     permission.id,
    //     permission.name,
    //   )),
    // );
  }
}
