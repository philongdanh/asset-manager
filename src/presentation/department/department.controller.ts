import { Controller, Post, Body } from '@nestjs/common';
import { CreateDepartmentRequest, DepartmentResponse } from './dto';
import { CreateDepartmentCommand } from 'src/application/commands/create-department.command';
import { CreateDepartmentHandler } from 'src/application/commands/handlers/create-department.handler';

@Controller('departments')
export class DepartmentController {
  constructor(
    private readonly createDepartmentHandler: CreateDepartmentHandler,
  ) { }

  @Post()
  async create(@Body() dto: CreateDepartmentRequest): Promise<DepartmentResponse> {
    const cmd = new CreateDepartmentCommand(
      dto.organizationId,
      dto.name,
      dto.parentId,
    );
    const dept = await this.createDepartmentHandler.execute(cmd);
    return new DepartmentResponse(dept);
  }
}
