import { Injectable, Inject } from '@nestjs/common';
import { EntityNotFoundException } from 'src/domain/core';
import { UpdateDepartmentCommand } from './update-department.command';
import {
  Department,
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/domain/identity/department';

@Injectable()
export class UpdateDepartmentUseCase {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(command: UpdateDepartmentCommand): Promise<Department> {
    const department = await this.departmentRepository.findById(
      command.departmentId,
    );
    if (!department) {
      throw new EntityNotFoundException(Department.name, command.departmentId);
    }

    department.updateInfo(command.name, command.parentId);
    await this.departmentRepository.save(department);
    return department;
  }
}
