import { Injectable, Inject } from '@nestjs/common';
import {
  PERMISSION_REPOSITORY,
  Permission,
  type IPermissionRepository,
} from 'src/domain/permission';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';
import { CommandValidationException } from '../exceptions/command-validation.exception';
import { BusinessRuleViolationException } from 'src/domain/exceptions/business-rule-violation.exception';
import { EntityAlreadyExistsException } from 'src/domain/exceptions/entity-already-exists.exception';

export interface CreatePermissionCommand {
  name: string;
  description: string;
}

@Injectable()
export class CreatePermissionUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(command: CreatePermissionCommand): Promise<Permission> {
    const { name, description } = command;

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
    const newPermission = Permission.createNew(id, name, description);

    return this.permissionRepository.save(newPermission);
  }
}
