import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInHandler } from '../commands/sign-in';
import { SignInCommand } from '../commands/sign-in';
import type { IUserRepository } from 'src/modules/user/domain';
import { USER_REPOSITORY } from 'src/modules/user/domain';
import { ROLE_REPOSITORY, type IRoleRepository } from 'src/modules/role/domain';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
} from 'src/modules/permission/domain';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly signInHandler: SignInHandler,
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(ROLE_REPOSITORY) private readonly roleRepo: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permRepo: IPermissionRepository,
  ) {}

  async signIn(command: SignInCommand) {
    const result = await this.signInHandler.execute(command);

    // Fetch permission names
    const roles = await this.roleRepo.findByUserId(result.id);
    const permissions = await this.permRepo.findByRoles(roles.map((r) => r.id));
    const permissionNames = permissions.map((p) => p.name);

    const tokens = await this.getTokens(
      result.id,
      result.username,
      permissionNames,
    );
    await this.updateRefreshToken(result.id, tokens.refresh_token);
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user: result,
    };
  }

  async logout(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (user) {
      user.setHashedRefreshToken(null);
      await this.userRepo.update(user);
    }
  }

  async refreshTokens(refreshToken: string) {
    let userId: string;
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        // secret: // need secret if different
      });
      userId = payload.sub || payload.id;
    } catch (e) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    const user = await this.userRepo.findById(userId);
    if (!user || !user.hashedRefreshToken)
      throw new UnauthorizedException('Access Denied');

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );
    if (!refreshTokenMatches) throw new UnauthorizedException('Access Denied');

    const roles = await this.roleRepo.findByUserId(user.id);
    const permissions = await this.permRepo.findByRoles(roles.map((r) => r.id));
    const permissionNames = permissions.map((p) => p.name);

    const tokens = await this.getTokens(
      user.id,
      user.username,
      permissionNames,
    );
    await this.updateRefreshToken(user.id, tokens.refresh_token);
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
      access_token: at,
      refresh_token: rt,
    };
  }
}
