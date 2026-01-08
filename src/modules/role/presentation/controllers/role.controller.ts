import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateRoleRequest,
  GetRolesRequest,
  UpdateRoleRequest,
  RoleResponse,
} from '../dto';
import {
  CreateRoleCommand,
  UpdateRoleCommand,
  DeleteRoleCommand,
  GetRolesQuery,
  GetRoleDetailsQuery,
  RoleResult,
  RoleListResult,
} from '../../application';
import { Permissions } from 'src/modules/auth/presentation';

@Controller('roles')
export class RoleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Permissions('ROLE_VIEW')
  @Get()
  async getList(
    @Query() query: GetRolesRequest,
  ): Promise<{ data: RoleResponse[]; total: number }> {
    const result = await this.queryBus.execute<GetRolesQuery, RoleListResult>(
      new GetRolesQuery(),
    );
    return {
      data: result.data.map((item) => new RoleResponse(item)),
      total: result.total,
    };
  }

  @Permissions('ROLE_VIEW')
  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<RoleResponse> {
    const result = await this.queryBus.execute<GetRoleDetailsQuery, RoleResult>(
      new GetRoleDetailsQuery(id),
    );
    return new RoleResponse(result);
  }

  @HttpCode(HttpStatus.CREATED)
  @Permissions('ROLE_CREATE')
  @Post()
  async create(@Body() dto: CreateRoleRequest): Promise<RoleResponse> {
    const cmd = new CreateRoleCommand(dto.name, dto.permissionIds);
    const result = await this.commandBus.execute<CreateRoleCommand, RoleResult>(cmd);
    return new RoleResponse(result);
  }

  @Permissions('ROLE_UPDATE')
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateRoleRequest,
  ): Promise<RoleResponse> {
    const cmd = new UpdateRoleCommand(id, dto.name, dto.permissionIds);
    const result = await this.commandBus.execute<UpdateRoleCommand, RoleResult>(cmd);
    return new RoleResponse(result);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('ROLE_DELETE')
  @Delete(':id')
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.commandBus.execute(new DeleteRoleCommand(id));
  }
}

