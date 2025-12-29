import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateRoleRequest, RoleResponse } from '../dto';
import { CreateRoleCommand } from '../../application';
import { Permissions } from 'src/modules/auth/presentation';
import { Role } from '../../domain';

@Controller('roles')
export class RoleController {
  constructor(private readonly commandBus: CommandBus) {}

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
    const role = await this.commandBus.execute(cmd);
    return new RoleResponse(role);
  }
}
