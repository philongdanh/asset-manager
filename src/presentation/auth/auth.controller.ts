import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { User } from 'src/domain/identity/user';
import { SignInHandler } from 'src/application/commands/handlers';
import { SignInDto } from './dto';
import { SignInCommand } from 'src/application/commands/sign-in.command';

@Controller('auth')
export class AuthController {
  constructor(private readonly signInHandler: SignInHandler) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: SignInDto): Promise<User> {
    const cmd = new SignInCommand(
      dto.organizationId,
      dto.username,
      dto.password,
    );
    const data = await this.signInHandler.execute(cmd);
    console.log(data);
    return data;
  }
}
