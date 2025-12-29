import { JwtService } from '@nestjs/jwt';
import { SignInHandler } from 'src/application/commands/handlers';
import { SignInDto, RefreshTokenDto } from './dto';
import { SignInCommand } from 'src/application/commands';
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common'; // Add Inject
import { User } from 'src/domain/identity/user';
import type { IUserRepository } from 'src/domain/identity/user';
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY } from 'src/domain/identity/user/user.repository.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly signInHandler: SignInHandler,
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
  ) { }

  async signIn(dto: SignInDto) {
    const cmd = new SignInCommand(
      dto.organizationId,
      dto.username,
      dto.password,
    );
    const result = await this.signInHandler.execute(cmd);
    const tokens = await this.getTokens(result.id, result.username);
    await this.updateRefreshToken(result.id, tokens.refresh_token);
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user: result,
    };
  }

  async logout(userId: string) {
    // We should clear the refresh token in DB
    // Assuming we have update logic in repo
    const user = await this.userRepo.findById(userId);
    if (user) {
      user.setHashedRefreshToken(null);
      await this.userRepo.update(user);
    }
  }

  async refreshTokens(dto: RefreshTokenDto) {
    // Decode refresh token to get user id (assuming payload has sub/id)
    let userId: string;
    try {
      const payload = await this.jwtService.verifyAsync(dto.refreshToken, {
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
      dto.refreshToken,
      user.hashedRefreshToken,
    );
    if (!refreshTokenMatches) throw new UnauthorizedException('Access Denied');

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    const user = await this.userRepo.findById(userId);
    if (user) {
      user.setHashedRefreshToken(hash);
      await this.userRepo.update(user);
    }
  }

  async getTokens(userId: string, username: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
          username,
        },
        {
          expiresIn: '15m', // Short lived
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
          username,
        },
        {
          expiresIn: '7d', // Long lived
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
