import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateDepartmentRequest, DepartmentResponse } from '../dto';
import { CreateDepartmentCommand } from '../../application';
import { Permissions } from 'src/modules/auth/presentation';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Permissions('DEPARTMENT_CREATE')
  @Post()
  async create(
    @Body() dto: CreateDepartmentRequest,
  ): Promise<DepartmentResponse> {
    const cmd = new CreateDepartmentCommand(
      dto.organizationId,
      dto.name,
      dto.parentId,
    );
    const dept: DepartmentResponse = await this.commandBus.execute(cmd);
    return new DepartmentResponse(dept);
  }
}
