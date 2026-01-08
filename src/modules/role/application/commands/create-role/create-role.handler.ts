import { Inject } from '@nestjs/common';
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
import { UseCaseException } from 'src/shared/application/exceptions';

@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler implements ICommandHandler<
  CreateRoleCommand,
  RoleResult
> {
  constructor(
    private readonly tCtx: TenantContextService,
    @Inject(ID_GENERATOR)
    private readonly idGenerator: IIdGenerator,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permRepo: IPermissionRepository,
  ) {}

  async execute(cmd: CreateRoleCommand): Promise<RoleResult> {
    const tenantId = this.tCtx.getTenantId();
    if (!tenantId) {
      throw new UseCaseException(
        'Tenant ID is missing in context',
        CreateRoleCommand.name,
      );
    }

    const id = this.idGenerator.generate();
    const role = Role.builder(id, tenantId, cmd.name).build();
    const savedRole = await this.roleRepo.save(role);

    if (cmd.permissionIds && cmd.permissionIds.length > 0) {
      await this.roleRepo.syncPerms(savedRole.id, cmd.permissionIds);
    }

    const permissions = await this.permRepo.findByRoles([savedRole.id]);
    return new RoleResult(savedRole, permissions);
  }
}
