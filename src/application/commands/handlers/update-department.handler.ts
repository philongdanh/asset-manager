import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/domain/identity/department';
import { UpdateDepartmentCommand } from '../update-department.command';

@Injectable()
export class UpdateDepartmentHandler {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(command: UpdateDepartmentCommand): Promise<void> {
    const department = await this.departmentRepository.findById(
      command.departmentId,
    );

    if (!department) {
      throw new UseCaseException(
        `Department with ID ${command.departmentId} not found`,
        UpdateDepartmentCommand.name,
      );
    }

    try {
      // Check name uniqueness if changing
      if (command.name && command.name !== department.name) {
        const existsByName = await this.departmentRepository.existsByName(
          department.organizationId,
          command.name,
        );
        if (existsByName) {
          throw new UseCaseException(
            `Department name ${command.name} already exists in this organization`,
            UpdateDepartmentCommand.name,
          );
        }
      }

      // Check parent department if changing
      if (
        command.parentId !== undefined &&
        command.parentId !== department.parentId
      ) {
        if (command.parentId) {
          const parentDepartment = await this.departmentRepository.findById(
            command.parentId,
          );
          if (!parentDepartment) {
            throw new UseCaseException(
              `Parent department with ID ${command.parentId} not found`,
              UpdateDepartmentCommand.name,
            );
          }
        }
      }

      department.updateDetails(
        command.name || department.name,
        command.parentId !== undefined ? command.parentId : department.parentId,
      );

      await this.departmentRepository.update(department);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to update department',
        UpdateDepartmentCommand.name,
      );
    }
  }
}
