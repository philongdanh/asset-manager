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
  CreatePermissionRequest,
  UpdatePermissionRequest,
  PermissionResponse,
} from '../dto';
import {
  CreatePermissionCommand,
  UpdatePermissionCommand,
  DeletePermissionCommand,
  GetPermissionsQuery,
  GetPermissionDetailsQuery,
} from '../../application';
import { Permissions } from 'src/modules/auth/presentation';
import { Permission } from '../../domain';

@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Permissions('PERMISSION_VIEW')
  @Get()
  async getList(): Promise<{ data: PermissionResponse[]; total: number }> {
    const result: { data: Permission[]; total: number } =
      await this.queryBus.execute(new GetPermissionsQuery());
    return {
      data: result.data.map((p) => new PermissionResponse(p)),
      total: result.total,
    };
  }

  @Permissions('PERMISSION_VIEW')
  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<PermissionResponse> {
    const permission: Permission = await this.queryBus.execute(
      new GetPermissionDetailsQuery(id),
    );
    return new PermissionResponse(permission);
  }

  @HttpCode(HttpStatus.CREATED)
  @Permissions('PERMISSION_CREATE')
  @Post()
  async create(
    @Body() dto: CreatePermissionRequest,
  ): Promise<PermissionResponse> {
    const cmd = new CreatePermissionCommand(dto.name, dto.description);
    const permission: Permission = await this.commandBus.execute(cmd);
    return new PermissionResponse(permission);
  }

  @Permissions('PERMISSION_UPDATE')
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdatePermissionRequest,
  ): Promise<PermissionResponse> {
    const cmd = new UpdatePermissionCommand(id, dto.name, dto.description);
    const permission: Permission = await this.commandBus.execute(cmd);
    return new PermissionResponse(permission);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('PERMISSION_DELETE')
  @Delete(':id')
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.commandBus.execute(new DeletePermissionCommand(id));
  }
}
