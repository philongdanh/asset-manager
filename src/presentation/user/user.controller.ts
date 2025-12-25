import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/domain/identity/user';
import { CreateUserCommand } from 'src/application/commands/create-user.command';
import { CreateUserHandler } from 'src/application/commands/handlers';
import { GetUsersQuery } from 'src/application/queries/get-users.query';
import { GetUsersDto } from './dto/get-users.dto';
import { GetUsersHandler } from 'src/application/queries/handlers';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserHandler: CreateUserHandler,
    private readonly getUserHandler: GetUsersHandler,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto): Promise<User> {
    const cmd = new CreateUserCommand(
      dto.organizationId,
      dto.username,
      dto.email,
      dto.departmentId,
    );
    return await this.createUserHandler.execute(cmd);
  }

  @Get()
  async get(@Param('organizationId') orgId: string, @Query() dto: GetUsersDto) {
    const cmd = new GetUsersQuery(orgId, {
      departmentId: dto.departmentId,
      roleId: dto.roleId,
      status: dto.status,
      limit: dto.limit,
      offset: dto.offset,
      search: dto.search,
      includeDeleted: dto.includeDeleted,
    });
    return await this.getUserHandler.execute(cmd);
  }
}
