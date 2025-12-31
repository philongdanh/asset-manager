import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RefreshTokenCommand } from './refresh-token.command';
import { USER_REPOSITORY, type IUserRepository } from 'src/modules/user/domain';
import { ROLE_REPOSITORY, type IRoleRepository } from 'src/modules/role/domain';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
} from 'src/modules/permission/domain';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(ROLE_REPOSITORY) private readonly roleRepo: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permRepo: IPermissionRepository,
  ) { }

  async execute(command: RefreshTokenCommand) {
    const { refreshToken } = command;
    let userId: string;

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);

      userId = payload.sub || payload.id;
    } catch {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    const user = await this.userRepo.findById(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    const roles = await this.roleRepo.findByUserId(user.id);
    const permissions = await this.permRepo.findByRoles(roles.map((r) => r.id));
    const permissionNames = permissions.map((p) => p.name);

    const tokens = await this.getTokens(
      user.id,
      user.username,
      permissionNames,
    );
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
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
          expiresIn: '24h',
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
          username,
          permissions,
        },
        {
          expiresIn: '30d',
        },
      ),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }
}
