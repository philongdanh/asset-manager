import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  USER_REPOSITORY,
  type IUserRepository,
  UserStatus,
} from 'src/domain/identity/user';
import { UpdateUserCommand } from '../update-user.command';

@Injectable()
export class UpdateUserHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UpdateUserCommand): Promise<void> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new UseCaseException(
        `User with ID ${command.userId} not found`,
        UpdateUserCommand.name,
      );
    }

    if (user.status === UserStatus.DELETED) {
      throw new UseCaseException(
        'Cannot update a deleted user',
        UpdateUserCommand.name,
      );
    }

    try {
      // Update fields
      if (command.username && command.username !== user.username) {
        // Check username uniqueness
        const existsByUsername = await this.userRepository.existsByUsername(
          user.organizationId,
          command.username,
        );
        if (existsByUsername) {
          throw new UseCaseException(
            `Username ${command.username} already exists in this organization`,
            UpdateUserCommand.name,
          );
        }
        user.updateUsername(command.username);
      }

      if (command.email && command.email !== user.email) {
        // Check email uniqueness
        const existsByEmail = await this.userRepository.existsByEmail(
          command.email,
        );
        if (existsByEmail) {
          throw new UseCaseException(
            `Email ${command.email} already in use by another user`,
            UpdateUserCommand.name,
          );
        }
        user.updateEmail(command.email);
      }

      if (command.departmentId !== undefined) {
        user.changeDepartment(command.departmentId);
      }

      await this.userRepository.update(user);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to update user',
        UpdateUserCommand.name,
      );
    }
  }
}
