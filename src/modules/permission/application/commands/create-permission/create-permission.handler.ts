import { Injectable, Inject } from '@nestjs/common';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
  Permission,
} from '../../../domain';
import { CreatePermissionCommand } from './create-permission.command';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreatePermissionCommand)
export class CreatePermissionHandler implements ICommandHandler<CreatePermissionCommand> {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(command: CreatePermissionCommand): Promise<Permission> {
    const id = this.idGenerator.generate();
    const builder = Permission.builder(id, command.name);

    if (command.description !== undefined)
      builder.withDescription(command.description);

    const permission = builder.build();
    return await this.permissionRepository.save(permission);
  }
}
