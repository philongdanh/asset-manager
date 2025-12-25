import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { GetPermissionsHandler } from 'src/application/queries/handlers/get-permissions.handler';
import { CreatePermissionHandler } from 'src/application/commands/handlers/create-permission.handler';
import { CreatePermissionCommand } from 'src/application/commands/create-permission.command';

@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly getPermissionsHandler: GetPermissionsHandler,
    private readonly createPermissionHandler: CreatePermissionHandler,
  ) {}

  @Get()
  async find() {
    return await this.getPermissionsHandler.execute();
  }

  @Post()
  async create(@Body() dto: CreatePermissionDto) {
    return await this.createPermissionHandler.execute(
      new CreatePermissionCommand(dto.name, dto.description),
    );
  }
}
