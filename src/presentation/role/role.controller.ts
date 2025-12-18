import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreateRoleUseCase, GetRolesUseCase } from 'src/application/role';

@Controller('roles')
export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly getRolesUseCase: GetRolesUseCase,
  ) {}

  @Get()
  async findAll(@Query('organizationId') organizationId: string) {
    const roles = await this.getRolesUseCase.execute(organizationId);
    return roles.map((role) => ({
      id: role.id,
      organizationId: role.organizationId,
      name: role.name,
      permissions: role.permissions.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
      })),
    }));
  }

  @Post()
  async create(@Body() dto: CreateRoleDto) {
    const result = await this.createRoleUseCase.execute({
      organizationId: dto.organizationId,
      name: dto.name,
      permissionIds: dto.permissionIds,
    });

    return {
      id: result.id,
      organizationId: result.organizationId,
      name: result.name,
      permissions: result.permissions.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
      })),
    };
  }
}
