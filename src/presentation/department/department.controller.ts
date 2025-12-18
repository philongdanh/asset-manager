import { Controller, Post, Body } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { CreateDepartmentUseCase } from 'src/application/department';

@Controller('departments')
export class DepartmentController {
  constructor(
    private readonly createDepartmentUseCase: CreateDepartmentUseCase,
  ) {}

  @Post()
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    const department = await this.createDepartmentUseCase.execute(
      createDepartmentDto.organizationId,
      createDepartmentDto.name,
      createDepartmentDto.parentId,
    );

    return {
      id: department.id,
      name: department.id,
      organization: {
        id: department.organizationId,
      },
      parent: {
        id: department.parentId,
      },
    };
  }
}
