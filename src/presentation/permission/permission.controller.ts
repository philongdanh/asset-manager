import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreatePermissionRequest, PermissionResponse } from './dto';
import { GetPermissionsHandler } from 'src/application/queries/handlers/get-permissions.handler';
import { CreatePermissionHandler } from 'src/application/commands/handlers/create-permission.handler';
import { CreatePermissionCommand } from 'src/application/commands/create-permission.command';

@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly getPermissionsHandler: GetPermissionsHandler,
    private readonly createPermissionHandler: CreatePermissionHandler,
  ) { }

  @Get()
  async find(): Promise<PermissionResponse[]> {
    const result = await this.getPermissionsHandler.execute();
    return result.data.map((p) => new PermissionResponse(p));
  }

  @Post()
  async create(@Body() dto: CreatePermissionRequest): Promise<PermissionResponse> {
    const cmd = new CreatePermissionCommand(dto.name, dto.description);
    const permission = await this.createPermissionHandler.execute(cmd);
    return new PermissionResponse(permission);
  }
}
