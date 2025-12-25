import * as bcrypt from 'bcrypt';
import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  USER_REPOSITORY,
  type IUserRepository,
  User,
} from 'src/domain/identity/user';
import { SignInCommand } from '../sign-in.command';

@Injectable()
export class SignInHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(cmd: SignInCommand): Promise<User> {
    const user = await this.userRepo.findByUsername(cmd.orgId, cmd.username);
    if (!user) {
      throw new UseCaseException(
        `Invalid username or password`,
        SignInCommand.name,
      );
    }

    if (user.isDeleted()) {
      throw new UseCaseException(
        `Account has been deleted`,
        SignInCommand.name,
      );
    }

    if (user.isSuspended()) {
      throw new UseCaseException(`Account is suspended`, SignInCommand.name);
    }
    if (user.isInactive()) {
      throw new UseCaseException(`Account is inactive`, SignInCommand.name);
    }

    const isPasswordValid = await bcrypt.compare(cmd.password, user.password);
    if (!isPasswordValid) {
      throw new UseCaseException(
        `Invalid username or password`,
        SignInCommand.name,
      );
    }

    if (user.isPending()) {
      user.activate();
      await this.userRepo.save(user);
    }

    return user;
  }
}
