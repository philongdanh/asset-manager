import { Inject, Injectable } from '@nestjs/common';
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
    return await this.userRepo.save(user);
  }
}
