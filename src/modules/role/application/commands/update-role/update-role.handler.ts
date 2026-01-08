import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRoleCommand } from './update-role.command';
import { ROLE_REPOSITORY, type IRoleRepository } from '../../../domain';
import { EntityNotFoundException } from 'src/shared/domain';
import {
  type IPermissionRepository,
  PERMISSION_REPOSITORY,
} from 'src/modules/permission';
import { RoleResult } from '../../dtos';

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleHandler implements ICommandHandler<
  UpdateRoleCommand,
  RoleResult
> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permRepo: IPermissionRepository,
  ) {}

  async execute(cmd: UpdateRoleCommand): Promise<RoleResult> {
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
      const currPerms = await this.permRepo.findByRoles([cmd.id]);

      const toRemove = currPerms.filter(
        (perm) => !cmd.permissionIds!.includes(perm.id),
      );
      if (toRemove.length > 0) {
        await this.roleRepo.detachPerms(
          cmd.id,
          toRemove.map((perm) => perm.id),
        );
      }

      const toAdd = cmd.permissionIds.filter(
        (id) => !currPerms.map((perm) => perm.id).includes(id),
      );
      if (toAdd.length > 0) {
        await this.roleRepo.attachPerms(cmd.id, toAdd);
      }
    }

    const savedRole = await this.roleRepo.save(role);
    const permissions = await this.permRepo.findByRoles([savedRole.id]);

    return new RoleResult(savedRole, permissions);
  }
}
