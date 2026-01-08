import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteRoleCommand } from './delete-role.command';
import { ROLE_REPOSITORY, type IRoleRepository } from '../../../domain';

@CommandHandler(DeleteRoleCommand)
export class DeleteRoleHandler implements ICommandHandler<DeleteRoleCommand> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: DeleteRoleCommand): Promise<void> {
    const role = await this.roleRepository.findById(command.roleId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${command.roleId} not found`);
    }

    await this.roleRepository.delete([command.roleId]);
  }
}
