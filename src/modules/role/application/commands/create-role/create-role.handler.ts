import { Inject, BadRequestException } from '@nestjs/common';
import { CreateRoleCommand } from './create-role.command';
import { ROLE_REPOSITORY, type IRoleRepository, Role } from '../../../domain';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';
import { TenantContextService } from 'src/shared/infrastructure/context/tenant-context.service';
import { RoleResult } from '../../dtos';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
} from 'src/modules/permission';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler implements ICommandHandler<CreateRoleCommand, RoleResult> {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
    private readonly tenantContext: TenantContextService,
  ) { }

  async execute(command: CreateRoleCommand): Promise<RoleResult> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) {
      throw new BadRequestException('Organization ID is missing in context');
    }

    const id = this.idGenerator.generate();
    const role = Role.builder(id, tenantId, command.name).build();
    const savedRole = await this.roleRepository.save(role);

    if (command.permIds && command.permIds.length > 0) {
      await this.roleRepository.assignPermissions(savedRole.id, command.permIds);
    }

    const permissions = await this.permissionRepository.findByRoles([savedRole.id]);
    return new RoleResult(savedRole, permissions, []);
  }
}

