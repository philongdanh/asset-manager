import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreateRoleHandler } from 'src/application/commands/handlers/create-role.handler';
import { CreateRoleCommand } from 'src/application/commands/create-role.command';

@Controller('roles')
export class RoleController {
  constructor(private readonly createRoleHandler: CreateRoleHandler) {}

  @Get()
  find(@Query('organizationId') organizationId: string) {
    console.log(organizationId);
  }

  @Post()
  async create(@Body() dto: CreateRoleDto) {
    return await this.createRoleHandler.execute(
      new CreateRoleCommand(dto.organizationId, dto.name, dto.permissionIds),
    );
  }
}
