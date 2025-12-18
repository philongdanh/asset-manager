import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import {
  CreatePermissionUseCase,
  GetPermissionsUseCase,
} from 'src/application/permission';

@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly getPermissionsUseCase: GetPermissionsUseCase,
    private readonly createPermissionUseCase: CreatePermissionUseCase,
  ) {}

  @Get()
  async find() {
    const permissions = await this.getPermissionsUseCase.execute();
    return permissions;
  }

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    const permission = await this.createPermissionUseCase.execute(
      createPermissionDto.name,
      createPermissionDto.description,
    );
    return permission;
  }
}
