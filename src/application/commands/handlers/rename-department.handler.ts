import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/domain/identity/department';
import { RenameDepartmentCommand } from '../rename-department.command';

@Injectable()
export class RenameDepartmentHandler {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(command: RenameDepartmentCommand): Promise<void> {
    const department = await this.departmentRepository.findById(
      command.departmentId,
    );

    if (!department) {
      throw new UseCaseException(
        `Department with ID ${command.departmentId} not found`,
        RenameDepartmentCommand.name,
      );
    }

    try {
      // Check name uniqueness
      if (command.name !== department.name) {
        const existsByName = await this.departmentRepository.existsByName(
          department.organizationId,
          command.name,
        );
        if (existsByName) {
          throw new UseCaseException(
            `Department name ${command.name} already exists in this organization`,
            RenameDepartmentCommand.name,
          );
        }
      }

      department.rename(command.name);
      await this.departmentRepository.update(department);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to rename department',
        RenameDepartmentCommand.name,
      );
    }
  }
}
