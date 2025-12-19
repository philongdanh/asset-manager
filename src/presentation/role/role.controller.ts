import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreateRoleUseCase, FindRolesUseCase } from 'src/application/role';

@Controller('roles')
export class RoleController {
  constructor(
    private readonly getRolesUseCase: FindRolesUseCase,
    private readonly createRoleUseCase: CreateRoleUseCase,
  ) {}

  @Get()
  async find(@Query('organizationId') organizationId: string) {
    const roles = await this.getRolesUseCase.execute(organizationId);
    return roles;
  }

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.createRoleUseCase.execute(
      createRoleDto.organizationId,
      createRoleDto.name,
    );

    return {
      id: role.id,
      organizationId: role.organizationId,
      name: role.name,
    };
  }
}
