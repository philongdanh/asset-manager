import { Controller, Post, Body, Get } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePermissionRequest, PermissionResponse } from '../dto';
import {
  CreatePermissionCommand,
  GetPermissionsQuery,
} from '../../application';
import { Permissions } from 'src/modules/auth/presentation';

@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Permissions('PERMISSION_VIEW')
  @Get()
  async find(): Promise<PermissionResponse[]> {
    const result: { data: PermissionResponse[]; total: number } =
      await this.queryBus.execute(new GetPermissionsQuery());
    return result.data.map((p) => new PermissionResponse(p));
  }

  @Post()
  async create(
    @Body() dto: CreatePermissionRequest,
  ): Promise<PermissionResponse> {
    const cmd = new CreatePermissionCommand(dto.name, dto.description);
    const permission: PermissionResponse = await this.commandBus.execute(cmd);
    return new PermissionResponse(permission);
  }
}
