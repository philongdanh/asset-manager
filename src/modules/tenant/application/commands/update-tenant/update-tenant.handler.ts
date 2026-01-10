import { Inject } from '@nestjs/common';
import {
  TENANT_REPOSITORY,
  type ITenantRepository,
  Tenant,
} from '../../../domain';
import { UpdateTenantCommand } from './update-tenant.command';
import { EntityNotFoundException } from 'src/shared/domain';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(UpdateTenantCommand)
export class UpdateTenantHandler implements ICommandHandler<UpdateTenantCommand> {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepo: ITenantRepository,
  ) {}

  async execute(cmd: UpdateTenantCommand): Promise<Tenant> {
    const tenant = await this.tenantRepo.findById(cmd.id);
    if (!tenant) {
      throw new EntityNotFoundException(Tenant.name, cmd.id);
    }
    tenant.updateInfo(
      cmd.name,
      cmd.code || null,
      cmd.phone || null,
      cmd.email || null,
      cmd.website || null,
      cmd.address || null,
      cmd.logo || null,
    );
    if (cmd.status !== undefined) {
      tenant.withStatus(cmd.status);
    }
    return await this.tenantRepo.save(tenant);
  }
}
