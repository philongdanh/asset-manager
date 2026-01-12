import { Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import { EntityNotFoundException } from 'src/shared/domain';
import {
  User,
  USER_REPOSITORY,
  UserStatus,
  type IUserRepository,
} from '../../../domain';
import { UpdateUserCommand } from './update-user.command';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(cmd: UpdateUserCommand): Promise<User> {
    const user = await this.userRepo.findById(cmd.id);
    if (!user) {
      throw new EntityNotFoundException(User.name, cmd.id);
    }
    if (cmd.email !== undefined) {
      const existsByEmail = await this.userRepo.existsByEmail(cmd.email);
      if (existsByEmail) {
        throw new UseCaseException(
          'User email already exist',
          UpdateUserHandler.name,
        );
      }
      user.updateEmail(cmd.email);
    }

    if (cmd.status) {
      if (cmd.status === UserStatus.ACTIVE) user.activate();
      else if (cmd.status === UserStatus.INACTIVE) user.deactivate();
    }

    if (cmd.departmentId) {
      user.changeDepartment(cmd.departmentId);
    }

    if (cmd.avatarUrl !== undefined) {
      user.updateAvatar(cmd.avatarUrl);
    }

    if (
      cmd.fullName !== undefined ||
      cmd.dateOfBirth !== undefined ||
      cmd.gender !== undefined ||
      cmd.phoneNumber !== undefined
    ) {
      user.updateProfile(
        cmd.fullName !== undefined ? cmd.fullName : user.fullName,
        cmd.dateOfBirth !== undefined ? cmd.dateOfBirth : user.dateOfBirth,
        cmd.gender !== undefined ? cmd.gender : user.gender,
        cmd.phoneNumber !== undefined ? cmd.phoneNumber : user.phoneNumber,
      );
    }
    return await this.userRepo.update(user);
  }
}
