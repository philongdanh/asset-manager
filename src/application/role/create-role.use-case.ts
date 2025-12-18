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
import { CommandValidationException } from '../exceptions/command-validation.exception';
import { EntityAlreadyExistsException } from 'src/domain/core';

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(organizationId: string, name: string): Promise<Role> {
    if (!organizationId) {
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
    if (!name) {
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
      organizationId,
      name,
    );
    if (existingRole) {
      throw new EntityAlreadyExistsException(Role.name, 'name', name);
    }

    const id = this.idGenerator.generate();
    const role = Role.create(id, organizationId, name);
    return this.roleRepository.save(role);
  }
}
