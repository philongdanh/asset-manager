import {
  Controller,
  Post,
  Body,
  Get,
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
  UpdateRoleRequest,
  DeleteRolesRequest,
  RoleResponse,
  RoleListResponse,
} from '../dto';
import {
  CreateRoleCommand,
  UpdateRoleCommand,
  DeleteRolesCommand,
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
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Permissions('ROLE_CREATE')
  @Post()
  async create(@Body() dto: CreateRoleRequest): Promise<RoleResponse> {
    const result = await this.commandBus.execute<CreateRoleCommand, RoleResult>(
      new CreateRoleCommand(dto.name, dto.permissionIds),
    );
    return new RoleResponse(result);
  }

  @Permissions('ROLE_VIEW')
  @Get()
  async getList(): Promise<RoleListResponse> {
    const result = await this.queryBus.execute<GetRolesQuery, RoleListResult>(
      new GetRolesQuery(),
    );
    return new RoleListResponse(result);
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

  @Permissions('ROLE_UPDATE')
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateRoleRequest,
  ): Promise<RoleResponse> {
    const result = await this.commandBus.execute<UpdateRoleCommand, RoleResult>(
      new UpdateRoleCommand(id, dto.name, dto.permissionIds),
    );
    return new RoleResponse(result);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('ROLE_DELETE')
  @Delete()
  async delete(@Body() dto: DeleteRolesRequest): Promise<void> {
    await this.commandBus.execute(new DeleteRolesCommand(dto.ids));
  }
}
