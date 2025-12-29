import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { CreateRoleRequest, RoleResponse } from './dto';
import { CreateRoleHandler } from 'src/application/commands/handlers/create-role.handler';
import { CreateRoleCommand } from 'src/application/commands/create-role.command';
import { Permissions } from '../auth/decorators';

@Controller('roles')
export class RoleController {
  constructor(private readonly createRoleHandler: CreateRoleHandler) { }

  @Permissions('ROLE_VIEW')
  @Get()
  find(@Query('organizationId') organizationId: string) {
    console.log(organizationId);
  }

  @Permissions('ROLE_CREATE')
  @Post()
  async create(@Body() dto: CreateRoleRequest): Promise<RoleResponse> {
    const cmd = new CreateRoleCommand(
      dto.organizationId,
      dto.name,
      dto.permissionIds,
    );
    const role = await this.createRoleHandler.execute(cmd);
    return new RoleResponse(role);
  }
}
