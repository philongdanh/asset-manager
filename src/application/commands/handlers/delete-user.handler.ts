import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from 'src/domain/identity/user';
import { DeleteUserCommand } from '../delete-user.command';

@Injectable()
export class DeleteUserHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new UseCaseException(
        `User with ID ${command.userId} not found`,
        DeleteUserCommand.name,
      );
    }

    // Already deleted
    if (user.isDeleted()) {
      return;
    }

    try {
      user.markAsDeleted();
      await this.userRepository.update(user);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to delete user',
        DeleteUserCommand.name,
      );
    }
  }
}
