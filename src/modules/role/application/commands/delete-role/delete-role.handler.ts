import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteRoleCommand } from './delete-role.command';
import { ROLE_REPOSITORY, type IRoleRepository } from '../../../domain';

@CommandHandler(DeleteRoleCommand)
export class DeleteRoleHandler implements ICommandHandler<
  DeleteRoleCommand,
  void
> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
  ) {}

  async execute(cmd: DeleteRoleCommand): Promise<void> {
    await this.roleRepo.delete(cmd.ids);
  }
}
