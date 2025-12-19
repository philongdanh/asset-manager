import { Injectable, Inject } from '@nestjs/common';
import {
  PERMISSION_REPOSITORY,
  Permission,
  type IPermissionRepository,
} from 'src/domain/identity/permission';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';
import { EntityAlreadyExistsException } from 'src/domain/core/exceptions/entity-already-exists.exception';
import { CommandValidationException } from 'src/application/exceptions/command-validation.exception';
import { CreatePermissionCommand } from './create-permission.command';

@Injectable()
export class CreatePermissionUseCase {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(command: CreatePermissionCommand): Promise<Permission> {
    if (!command.name) {
      throw new CommandValidationException([
        {
          field: 'name',
          message: 'Permission name is required.',
        },
      ]);
    }

    const existingPermission = await this.permissionRepository.findByName(
      command.name,
    );
    if (existingPermission) {
      throw new EntityAlreadyExistsException(
        'Permission',
        'name',
        command.name,
      );
    }

    const id = this.idGenerator.generate();
    const permission = Permission.create(id, command.name, command.description);
    return this.permissionRepository.save(permission);
  }
}
