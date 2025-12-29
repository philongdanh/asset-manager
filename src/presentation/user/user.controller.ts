import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserCommand } from 'src/application/commands/create-user.command';
import {
  CreateUserHandler,
  UpdateUserHandler,
} from 'src/application/commands/handlers';
import {
  GetUserDetailsHandler,
  GetUsersHandler,
} from 'src/application/queries/handlers';
import { Permissions } from '../auth/decorators';
import {
  CreateUserRequest,
  GetUsersRequest,
  UpdateUserRequest,
  UserResponse,
} from './dto';
import { UpdateUserCommand } from 'src/application/commands';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly createUserHandler: CreateUserHandler,
    private readonly getUsersHandler: GetUsersHandler,
    private readonly getUserDetailsHandler: GetUserDetailsHandler,
    private readonly updateUserHandler: UpdateUserHandler,
  ) { }

  @HttpCode(HttpStatus.CREATED)
  @Permissions('USER_CREATE')
  @Post()
  async create(@Body() dto: CreateUserRequest): Promise<UserResponse> {
    const cmd = new CreateUserCommand(
      dto.organizationId,
      dto.username,
      dto.password,
      dto.email,
      dto.departmentId,
      dto.status,
    );
    const result = await this.createUserHandler.execute(cmd);
    return new UserResponse(result);
  }

  @Permissions('USER_VIEW')
  @Get()
  async getList(@Query() query: GetUsersRequest): Promise<{ data: UserResponse[], total: number }> {
    const result = await this.getUsersHandler.execute({
      organizationId: '', // TODO: extract from context
      options: {
        departmentId: query.departmentId,
        status: query.status,
        roleId: query.roleId,
        search: query.search,
        limit: query.limit,
        offset: query.offset,
        includeDeleted: query.includeDeleted,
      },
    });
    return {
      data: result.data.map(u => new UserResponse(u)),
      total: result.total
    };
  }

  @Permissions('USER_VIEW')
  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<UserResponse> {
    const user = await this.getUserDetailsHandler.execute({ userId: id });
    return new UserResponse(user);
  }

  @Permissions('USER_UPDATE')
  @Patch(':id')
  async updateInfo(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateUserRequest,
  ): Promise<UserResponse> {
    const cmd = new UpdateUserCommand(
      id,
      dto.email,
      dto.departmentId,
      dto.status,
    );
    const user = await this.updateUserHandler.execute(cmd);
    return new UserResponse(user);
  }
}
