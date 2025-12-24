import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/domain/identity/department';
import { RestoreDepartmentCommand } from '../restore-department.command';

@Injectable()
export class RestoreDepartmentHandler {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(command: RestoreDepartmentCommand): Promise<void> {
    const department = await this.departmentRepository.findById(
      command.departmentId,
    );

    if (!department) {
      throw new UseCaseException(
        `Department with ID ${command.departmentId} not found`,
        RestoreDepartmentCommand.name,
      );
    }

    try {
      await this.departmentRepository.restore(command.departmentId);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to restore department',
        RestoreDepartmentCommand.name,
      );
    }
  }
}
