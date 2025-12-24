import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from 'src/domain/identity/user';
import { RestoreUserCommand } from '../restore-user.command';

@Injectable()
export class RestoreUserHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: RestoreUserCommand): Promise<void> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new UseCaseException(
        `User with ID ${command.userId} not found`,
        RestoreUserCommand.name,
      );
    }

    // Only restore if currently deleted
    if (!user.isDeleted()) {
      throw new UseCaseException(
        'Only deleted users can be restored',
        RestoreUserCommand.name,
      );
    }

    try {
      user.restore();
      await this.userRepository.update(user);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to restore user',
        RestoreUserCommand.name,
      );
    }
  }
}
