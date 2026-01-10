import { Inject } from '@nestjs/common';
import {
  TENANT_REPOSITORY,
  type ITenantRepository,
  Tenant,
} from '../../../domain';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';
import { CreateTenantCommand } from './create-tenant.command';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateTenantCommand)
export class CreateTenantHandler implements ICommandHandler<
  CreateTenantCommand,
  Tenant
> {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepo: ITenantRepository,
  ) {}

  async execute(cmd: CreateTenantCommand): Promise<Tenant> {
    const id = this.idGenerator.generate();
    const tenant = Tenant.builder(id, cmd.name)
      .withStatus(cmd.status)
      .withCode(cmd.code)
      .withContactInfo(cmd.phone, cmd.email, cmd.website, cmd.address, cmd.logo)
      .build();
    return await this.tenantRepo.save(tenant);
  }
}
