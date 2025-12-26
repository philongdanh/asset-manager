import { JwtService } from '@nestjs/jwt';
import { SignInHandler } from 'src/application/commands/handlers';
import { SignInDto } from './dto';
import { SignInCommand } from 'src/application/commands';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly signInHandler: SignInHandler,
  ) {}

  async signIn(dto: SignInDto) {
    const cmd = new SignInCommand(
      dto.organizationId,
      dto.username,
      dto.password,
    );
    const result = await this.signInHandler.execute(cmd);
    const accessToken = await this.jwtService.signAsync({
      id: result.id,
      username: result.username,
      status: result.status,
      roles: result.roles,
      permissions: result.permissions,
    });
    return {
      access_token: accessToken,
      user: result,
    };
  }
}
