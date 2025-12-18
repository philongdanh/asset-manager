import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import {
  CreatePermissionUseCase,
  GetPermissionsUseCase,
} from 'src/application/permission';

@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly createPermissionUseCase: CreatePermissionUseCase,
    private readonly getPermissionsUseCase: GetPermissionsUseCase,
  ) {}

  @Get()
  async findAll() {
    const permissions = await this.getPermissionsUseCase.execute();
    return permissions.map((permission) => ({
      id: permission.id,
      name: permission.name,
      description: permission.description,
      roles: permission.roles.map((role) => ({
        id: role.id,
        name: role.name,
        organizationId: role.organizationId,
      })),
    }));
  }

  @Post()
  async create(@Body() dto: CreatePermissionDto) {
    const result = await this.createPermissionUseCase.execute({
      name: dto.name,
      description: dto.description,
    });

    return {
      id: result.id,
      name: result.name,
      description: result.description,
      roles: result.roles.map((role) => ({
        id: role.id,
        name: role.name,
        organizationId: role.organizationId,
      })),
    };
  }
}
