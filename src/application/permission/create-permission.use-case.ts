import { Injectable, Inject } from '@nestjs/common';
import {
  PERMISSION_REPOSITORY,
  Permission,
  type IPermissionRepository,
} from 'src/domain/identity/permission';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';
import { CommandValidationException } from '../exceptions/command-validation.exception';
import { EntityAlreadyExistsException } from 'src/domain/core/exceptions/entity-already-exists.exception';

@Injectable()
export class CreatePermissionUseCase {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(name: string, description: string | null): Promise<Permission> {
    if (!name) {
      throw new CommandValidationException([
        {
          field: 'name',
          message: 'Permission name is required.',
        },
      ]);
    }

    const existingPermission = await this.permissionRepository.findByName(name);
    if (existingPermission) {
      throw new EntityAlreadyExistsException('Permission', 'name', name);
    }

    const id = this.idGenerator.generate();
    const permission = Permission.create(id, name, description);
    return this.permissionRepository.save(permission);
  }
}
