import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteRolesCommand } from './delete-role.command';
import { ROLE_REPOSITORY, type IRoleRepository } from '../../../domain';

@CommandHandler(DeleteRolesCommand)
export class DeleteRolesHandler implements ICommandHandler<
  DeleteRolesCommand,
  void
> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
  ) {}

  async execute(cmd: DeleteRolesCommand): Promise<void> {
    await this.roleRepo.delete(cmd.ids);
  }
}
