import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from './delete-user.command';
import { USER_REPOSITORY, type IUserRepository } from '../../../domain';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const exists = await this.userRepository.existsById(command.userId);
    if (!exists) {
      throw new NotFoundException(`User with ID ${command.userId} not found`);
    }

    await this.userRepository.delete(command.userId);
  }
}
