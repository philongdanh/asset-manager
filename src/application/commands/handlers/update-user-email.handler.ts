import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  USER_REPOSITORY,
  type IUserRepository,
  UserStatus,
} from 'src/domain/identity/user';
import { UpdateUserEmailCommand } from '../update-user-email.command';

@Injectable()
export class UpdateUserEmailHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UpdateUserEmailCommand): Promise<void> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new UseCaseException(
        `User with ID ${command.userId} not found`,
        UpdateUserEmailCommand.name,
      );
    }

    if (user.status === UserStatus.DELETED) {
      throw new UseCaseException(
        'Cannot update email of a deleted user',
        UpdateUserEmailCommand.name,
      );
    }

    try {
      // Check email uniqueness
      if (command.email !== user.email) {
        const existsByEmail = await this.userRepository.existsByEmail(
          command.email,
        );
        if (existsByEmail) {
          throw new UseCaseException(
            `Email ${command.email} already in use by another user`,
            UpdateUserEmailCommand.name,
          );
        }
      }

      user.updateEmail(command.email);
      await this.userRepository.update(user);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to update user email',
        UpdateUserEmailCommand.name,
      );
    }
  }
}
