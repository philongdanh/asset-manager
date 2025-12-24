import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions/use-case.exception';
import {
  USER_REPOSITORY,
  type IUserRepository,
  UserStatus,
} from 'src/domain/identity/user';
import { ChangeUserDepartmentCommand } from '../change-user-department.command';

@Injectable()
export class ChangeUserDepartmentHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: ChangeUserDepartmentCommand): Promise<void> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new UseCaseException(
        `User with ID ${command.userId} not found`,
        ChangeUserDepartmentCommand.name,
      );
    }

    if (user.status === UserStatus.DELETED) {
      throw new UseCaseException(
        'Cannot change department of a deleted user',
        ChangeUserDepartmentCommand.name,
      );
    }

    try {
      user.changeDepartment(command.departmentId);
      await this.userRepository.update(user);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to change user department',
        ChangeUserDepartmentCommand.name,
      );
    }
  }
}
