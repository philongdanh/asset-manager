import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  USER_REPOSITORY,
  type IUserRepository,
  UserStatus,
} from 'src/domain/identity/user';
import { ActivateUserCommand } from '../activate-user.command';

@Injectable()
export class ActivateUserHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: ActivateUserCommand): Promise<void> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new UseCaseException(
        `User with ID ${command.userId} not found`,
        ActivateUserCommand.name,
      );
    }

    if (user.status === UserStatus.DELETED) {
      throw new UseCaseException(
        'Cannot activate a deleted user',
        ActivateUserCommand.name,
      );
    }

    try {
      user.activate();
      await this.userRepository.update(user);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to activate user',
        ActivateUserCommand.name,
      );
    }
  }
}
