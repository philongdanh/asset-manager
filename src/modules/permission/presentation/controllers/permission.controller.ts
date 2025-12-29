import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreatePermissionRequest, PermissionResponse } from '../dto';
import {
  GetPermissionsHandler,
  CreatePermissionHandler,
  CreatePermissionCommand,
} from '../../application';
import { Permissions } from 'src/modules/auth/presentation';

@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly getPermissionsHandler: GetPermissionsHandler,
    private readonly createPermissionHandler: CreatePermissionHandler,
  ) {}

  @Permissions('PERMISSION_VIEW')
  @Get()
  async find(): Promise<PermissionResponse[]> {
    const result = await this.getPermissionsHandler.execute();
    return result.data.map((p) => new PermissionResponse(p));
  }

  @Post()
  async create(
    @Body() dto: CreatePermissionRequest,
  ): Promise<PermissionResponse> {
    const cmd = new CreatePermissionCommand(dto.name, dto.description);
    const permission = await this.createPermissionHandler.execute(cmd);
    return new PermissionResponse(permission);
  }
}
