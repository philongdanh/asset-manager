import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SignInDto, RefreshTokenDto } from '../dto';
import { AuthResponse, TokenResponse } from '../dto/responses';
import { SignInCommand, RefreshTokenCommand } from '../../application';
import { Public } from '../decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: SignInDto): Promise<AuthResponse> {
    const cmd = new SignInCommand(
      dto.organizationId,
      dto.username,
      dto.password,
    );

    const result: any = await this.commandBus.execute(cmd);
    return new AuthResponse(
      result.accessToken as string,
      result.refreshToken as string,
      result.user,
    );
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto): Promise<TokenResponse> {
    const cmd = new RefreshTokenCommand(dto.refreshToken);

    const result: any = await this.commandBus.execute(cmd);
    return new TokenResponse(
      result.accessToken as string,
      result.refreshToken as string,
    );
  }
}
