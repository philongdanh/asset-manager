import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from 'src/domain/identity/user';
import { AssignRoleToUserCommand } from '../assign-role-to-user.command';

@Injectable()
export class AssignRoleToUserHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: AssignRoleToUserCommand): Promise<void> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new UseCaseException(
        `User with ID ${command.userId} not found`,
        AssignRoleToUserCommand.name,
      );
    }

    if (user.isDeleted()) {
      throw new UseCaseException(
        'Cannot assign roles to a deleted user',
        AssignRoleToUserCommand.name,
      );
    }

    try {
      // Check if user already has this role
      const hasRole = await this.userRepository.hasRole(
        command.userId,
        command.roleId,
      );
      if (hasRole) {
        return; // Already has the role, no action needed
      }

      await this.userRepository.assignRole(command.userId, command.roleId);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to assign role to user',
        AssignRoleToUserCommand.name,
      );
    }
  }
}
