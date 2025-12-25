import { Controller, Post, Body } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { CreateDepartmentCommand } from 'src/application/commands/create-department.command';
import { CreateDepartmentHandler } from 'src/application/commands/handlers/create-department.handler';

@Controller('departments')
export class DepartmentController {
  constructor(
    private readonly createDepartmentHandler: CreateDepartmentHandler,
  ) {}

  @Post()
  async create(@Body() dto: CreateDepartmentDto) {
    const cmd = new CreateDepartmentCommand(
      dto.organizationId,
      dto.name,
      dto.parentId,
    );
    return await this.createDepartmentHandler.execute(cmd);
  }
}
