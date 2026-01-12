import {
  Body,
  Controller,
  Get,
  Delete,
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
  DeleteUserCommand,
  GetUsersQuery,
  GetUserDetailsQuery,
} from '../../application';
import { CurrentUser, Permissions } from 'src/modules/auth/presentation';
import { User } from '../../domain';
import {
  CreateUserRequest,
  GetUsersRequest,
  UpdateUserRequest,
  UserResponse,
} from '../dto';
import { type JwtPayload } from 'src/modules/auth/presentation/interfaces/jwt-payload.interface';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

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
      dto.avatarUrl,
      dto.fullName,
      dto.dateOfBirth,
      dto.gender,
      dto.phoneNumber,
    );
    const result: User = await this.commandBus.execute(cmd);
    return new UserResponse(result);
  }

  @Permissions('USER_VIEW')
  @Get()
  async getList(
    @CurrentUser() user: JwtPayload,
    @Query() query: GetUsersRequest,
  ): Promise<{ data: UserResponse[]; total: number }> {
    const qry = new GetUsersQuery(user.organizationId, {
      // TODO: extract organizationId from context
      departmentId: query.departmentId,
      status: query.status,
      roleId: query.roleId,
      search: query.search,
      limit: query.limit,
      offset: query.offset,
      includeDeleted: query.includeDeleted,
    });

    const result: { data: User[]; total: number } =
      await this.queryBus.execute(qry);
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
    const user: User = await this.queryBus.execute(query);
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
      dto.avatarUrl,
      dto.fullName,
      dto.dateOfBirth,
      dto.gender,
      dto.phoneNumber,
    );
    const user: User = await this.commandBus.execute(cmd);
    return new UserResponse(user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('USER_DELETE')
  @Delete(':id')
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.commandBus.execute(new DeleteUserCommand(id));
  }
}
