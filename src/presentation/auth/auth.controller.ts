import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SignInDto, RefreshTokenDto } from './dto';
import { AuthService } from 'src/application/services';
import { Public } from './decorators/public.decorator';
import { SignInCommand } from 'src/application/commands';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: SignInDto) {
    const cmd = new SignInCommand(
      dto.organizationId,
      dto.username,
      dto.password,
    );
    return this.authService.signIn(cmd);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }
}
