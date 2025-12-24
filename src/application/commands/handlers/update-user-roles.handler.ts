import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from 'src/domain/identity/user';
import { UpdateUserRolesCommand } from '../update-user-roles.command';

@Injectable()
export class UpdateUserRolesHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UpdateUserRolesCommand): Promise<void> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new UseCaseException(
        `User with ID ${command.userId} not found`,
        UpdateUserRolesCommand.name,
      );
    }

    if (user.isDeleted()) {
      throw new UseCaseException(
        'Cannot update roles of a deleted user',
        UpdateUserRolesCommand.name,
      );
    }

    try {
      await this.userRepository.updateRoles(command.userId, command.roleIds);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to update user roles',
        UpdateUserRolesCommand.name,
      );
    }
  }
}
