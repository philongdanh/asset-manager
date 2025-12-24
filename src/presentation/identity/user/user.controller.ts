import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/domain/identity/user';
import {
  CreateUserUseCase,
  CreateUserCommand,
} from 'src/application/identity/commands/create-user';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto): Promise<User> {
    const command = new CreateUserCommand(
      dto.organizationId,
      dto.username,
      dto.email,
      dto.departmentId,
      dto.roleIds,
    );

    const user = await this.createUserUseCase.execute(command);
    return user;
  }
}
