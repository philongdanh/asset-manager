import { Injectable, Inject } from '@nestjs/common';
import {
  ROLE_REPOSITORY,
  Role,
  type IRoleRepository,
} from 'src/domain/identity/role';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
} from 'src/domain/identity/permission';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';
import { CommandValidationException } from '../../../exceptions/command-validation.exception';
import { EntityAlreadyExistsException } from 'src/domain/core';
import { CreateRoleCommand } from './create-role.command';

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(command: CreateRoleCommand): Promise<Role> {
    if (!command.organizationId) {
      throw new CommandValidationException(
        [
          {
            field: 'organization',
            message: 'Organization is required.',
          },
        ],
        CreateRoleUseCase.name,
      );
    }
    if (!command.name) {
      throw new CommandValidationException(
        [
          {
            field: 'name',
            message: 'Name is required.',
          },
        ],
        CreateRoleUseCase.name,
      );
    }

    const existingRole = await this.roleRepository.findByName(
      command.organizationId,
      command.name,
    );
    if (existingRole) {
      throw new EntityAlreadyExistsException(Role.name, 'name', command.name);
    }

    if (command.permissionIds && command.permissionIds.length > 0) {
      const validPermissions = await this.permissionRepository.findByIds(
        command.permissionIds,
      );
      if (validPermissions.length !== command.permissionIds.length) {
        throw new CommandValidationException([
          {
            field: 'permissionIds',
            message: 'One or more permission IDs are invalid.',
          },
        ]);
      }
    }

    const id = this.idGenerator.generate();
    const role = Role.create(
      id,
      command.organizationId,
      command.name,
      command.permissionIds || [],
    );
    return this.roleRepository.save(role);
  }
}
