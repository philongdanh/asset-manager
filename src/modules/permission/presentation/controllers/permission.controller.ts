import { Controller, Post, Body, Get } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePermissionRequest, PermissionResponse } from '../dto';
import {
  CreatePermissionCommand,
  GetPermissionsQuery,
} from '../../application';
import { Permissions } from 'src/modules/auth/presentation';
import { Permission } from '../../domain';

@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Permissions('PERMISSION_VIEW')
  @Get()
  async find(): Promise<PermissionResponse[]> {
    const result = (await this.queryBus.execute(
      new GetPermissionsQuery(),
    )) as {
      data: Permission[];
      total: number;
    };
    return result.data.map((p) => new PermissionResponse(p));
  }

  @Post()
  async create(
    @Body() dto: CreatePermissionRequest,
  ): Promise<PermissionResponse> {
    const cmd = new CreatePermissionCommand(dto.name, dto.description);
    const permission = (await this.commandBus.execute(cmd)) as Permission;
    return new PermissionResponse(permission);
  }
}
