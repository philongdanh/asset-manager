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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateUserCommand,
  UpdateUserCommand,
  GetUsersQuery,
  GetUserDetailsQuery,
} from '../../application';
import { Permissions } from 'src/modules/auth/presentation';
import {
  CreateUserRequest,
  GetUsersRequest,
  UpdateUserRequest,
  UserResponse,
} from '../dto';
import { User } from '../../domain';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
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
    const result = (await this.commandBus.execute(cmd)) as User;
    return new UserResponse(result);
  }

  @Permissions('USER_VIEW')
  @Get()
  async getList(
    @Query() query: GetUsersRequest,
  ): Promise<{ data: UserResponse[]; total: number }> {
    const qry = new GetUsersQuery('', {
      // TODO: extract organizationId from context
      departmentId: query.departmentId,
      status: query.status,
      roleId: query.roleId,
      search: query.search,
      limit: query.limit,
      offset: query.offset,
      includeDeleted: query.includeDeleted,
    });

    const result = (await this.queryBus.execute(
      qry,
    )) as { data: User[]; total: number };
    return {
      data: result.data.map((u) => new UserResponse(u)),
      total: result.total,
    };
  }

  @Permissions('USER_VIEW')
  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<UserResponse> {
    const query = new GetUserDetailsQuery(id);
    const user = (await this.queryBus.execute(query)) as User;
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
    const user = (await this.commandBus.execute(cmd)) as User;
    return new UserResponse(user);
  }
}
