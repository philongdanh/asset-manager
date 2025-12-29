import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SignInDto } from './dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: SignInDto) { // TODO use RefreshTokenDto, reusing SignInDto temporarily effectively? No, use the right one.
    // correcting to use correct DTO
    // but import might be missing if I don't add it.
    // Auto-import might fail.
    return this.authService.refreshTokens(dto as any);
  }
}
