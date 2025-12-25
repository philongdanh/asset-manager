import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/domain/identity/user';
import { CreateUserCommand } from 'src/application/commands/create-user.command';
import { CreateUserHandler } from 'src/application/commands/handlers';

@Controller('users')
export class UserController {
  constructor(private readonly createUserHandler: CreateUserHandler) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto): Promise<User> {
    const command = new CreateUserCommand(
      dto.organizationId,
      dto.username,
      dto.email,
      dto.departmentId,
    );
    return await this.createUserHandler.execute(command);
  }
}
