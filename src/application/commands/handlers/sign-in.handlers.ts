import * as bcrypt from 'bcrypt';
import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from 'src/domain/identity/user';
import { SignInCommand } from '../sign-in.command';
import {
  type IRoleRepository,
  ROLE_REPOSITORY,
} from 'src/domain/identity/role';
import { type IOrganizationRepository, ORGANIZATION_REPOSITORY } from 'src/domain/identity/organization';

@Injectable()
export class SignInHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepo: IOrganizationRepository,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
  ) {}

  async execute(cmd: SignInCommand) {
    const user = await this.userRepo.findByUsername(cmd.orgId, cmd.username);
    if (!user) {
      throw new UseCaseException(
        `Invalid username or password`,
        SignInCommand.name,
      );
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

    const org = await this.orgRepo.findById(user.organizationId);
    if (!org) {
      throw new Error('');
    }
    const roles = await this.roleRepo.findByUserId(user.id);

    return {
      id: user.id,
      username: user.username,
      org: {
        id: org.id,
        name: org.name,
      },
      email: user.email,
      roles: roles.map((role) => ({ id: role.id, name: role.name })),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
