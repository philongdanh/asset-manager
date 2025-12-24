import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/domain/identity/department';
import { DeleteDepartmentCommand } from '../delete-department.command';

@Injectable()
export class DeleteDepartmentHandler {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(command: DeleteDepartmentCommand): Promise<void> {
    const department = await this.departmentRepository.findById(
      command.departmentId,
    );

    if (!department) {
      throw new UseCaseException(
        `Department with ID ${command.departmentId} not found`,
        DeleteDepartmentCommand.name,
      );
    }

    // Check if department has dependencies (child departments, users, assets, etc.)
    const hasDependencies = await this.departmentRepository.hasDependencies(
      command.departmentId,
    );
    if (hasDependencies) {
      throw new UseCaseException(
        'Cannot delete department because it has dependencies. Please remove or reassign them first.',
        DeleteDepartmentCommand.name,
      );
    }

    try {
      await this.departmentRepository.delete(command.departmentId);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to delete department',
        DeleteDepartmentCommand.name,
      );
    }
  }
}
