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
      await this.roleRepo.syncPerms(cmd.id, cmd.permissionIds);
    }

    const savedRole = await this.roleRepo.save(role);
    const perms = await this.permRepo.findByRoles([savedRole.id]);

    return new RoleResult(savedRole, perms);
  }
}
