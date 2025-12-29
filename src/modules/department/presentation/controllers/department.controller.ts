import { Controller, Post, Body } from '@nestjs/common';
import { CreateDepartmentRequest, DepartmentResponse } from '../dto';
import {
  CreateDepartmentCommand,
  CreateDepartmentHandler,
} from '../../application';
import { Permissions } from 'src/modules/auth/presentation';

@Controller('departments')
export class DepartmentController {
  constructor(
    private readonly createDepartmentHandler: CreateDepartmentHandler,
  ) {}

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
    const dept = await this.createDepartmentHandler.execute(cmd);
    return new DepartmentResponse(dept);
  }
}
