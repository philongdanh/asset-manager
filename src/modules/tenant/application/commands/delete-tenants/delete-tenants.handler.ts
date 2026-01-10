import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTenantsCommand } from './delete-tenants.command';
import { TENANT_REPOSITORY, type ITenantRepository } from 'src/modules/tenant';

@CommandHandler(DeleteTenantsCommand)
export class DeleteTenantHandler implements ICommandHandler<
  DeleteTenantsCommand,
  void
> {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepo: ITenantRepository,
  ) {}

  async execute(cmd: DeleteTenantsCommand): Promise<void> {
    await this.tenantRepo.delete(cmd.tenantIds);
  }
}
