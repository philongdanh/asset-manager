import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
  Department,
} from 'src/domain/identity/department';
import { CreateDepartmentCommand } from '../create-department.command';

@Injectable()
export class CreateDepartmentHandler {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(command: CreateDepartmentCommand): Promise<Department> {
    // Validate unique constraint
    const existsByName = await this.departmentRepository.existsByName(
      command.organizationId,
      command.name,
    );
    if (existsByName) {
      throw new UseCaseException(
        `Department with name ${command.name} already exists in this organization`,
        CreateDepartmentCommand.name,
      );
    }

    // Validate parent department if provided
    if (command.parentId) {
      const parentDepartment = await this.departmentRepository.findById(
        command.parentId,
      );
      if (!parentDepartment) {
        throw new UseCaseException(
          `Parent department with ID ${command.parentId} not found`,
          CreateDepartmentCommand.name,
        );
      }
    }

    try {
      // Build department entity
      const builder = Department.builder(
        command.id,
        command.organizationId,
        command.name,
      ).withParent(command.parentId || null);

      const department = builder.build();

      // Save to repository
      return await this.departmentRepository.save(department);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to create department',
        CreateDepartmentCommand.name,
      );
    }
  }
}
