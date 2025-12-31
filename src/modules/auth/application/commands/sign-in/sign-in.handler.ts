import * as bcrypt from 'bcrypt';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UseCaseException } from 'src/shared/application/exceptions';
import { USER_REPOSITORY, type IUserRepository } from 'src/modules/user/domain';
import { SignInCommand } from './sign-in.command';
import { type IRoleRepository, ROLE_REPOSITORY } from 'src/modules/role/domain';
import {
  type IPermissionRepository,
  PERMISSION_REPOSITORY,
} from 'src/modules/permission/domain';

@CommandHandler(SignInCommand)
export class SignInHandler implements ICommandHandler<SignInCommand> {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permRepo: IPermissionRepository,
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

    const roles = await this.roleRepo.findByUserId(user.id);
    const permissions = await this.permRepo.findByRoles(
      roles.map((role) => role.id),
    );
    const permissionNames = permissions.map((perm) => perm.name);

    const tokens = await this.getTokens(
      user.id,
      user.username,
      permissionNames,
    );
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        organizationId: user.organizationId,
        departmentId: user.departmentId,
        status: user.status,
        roles: roles.map((role) => role.name),
        permissions: permissions.map((perm) => perm.id),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    const user = await this.userRepo.findById(userId);
    if (user) {
      user.setHashedRefreshToken(hash);
      await this.userRepo.update(user);
    }
  }

  private async getTokens(
    userId: string,
    username: string,
    permissions: string[],
  ) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
          username,
          permissions,
        },
        {
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
          username,
          permissions,
        },
        {
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }
}
