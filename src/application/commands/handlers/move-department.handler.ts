import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/domain/identity/department';
import { MoveDepartmentCommand } from '../move-department.command';

@Injectable()
export class MoveDepartmentHandler {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(command: MoveDepartmentCommand): Promise<void> {
    const department = await this.departmentRepository.findById(
      command.departmentId,
    );

    if (!department) {
      throw new UseCaseException(
        `Department with ID ${command.departmentId} not found`,
        MoveDepartmentCommand.name,
      );
    }

    try {
      // Check if trying to move to itself
      if (command.parentId === department.id) {
        throw new UseCaseException(
          'A department cannot be its own parent',
          MoveDepartmentCommand.name,
        );
      }

      // Check parent department if provided
      if (command.parentId) {
        const parentDepartment = await this.departmentRepository.findById(
          command.parentId,
        );
        if (!parentDepartment) {
          throw new UseCaseException(
            `Parent department with ID ${command.parentId} not found`,
            MoveDepartmentCommand.name,
          );
        }
      }

      department.moveToParent(command.parentId);
      await this.departmentRepository.update(department);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to move department',
        MoveDepartmentCommand.name,
      );
    }
  }
}
