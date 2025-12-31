import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateDepartmentCommand } from './update-department.command';
import {
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
  Department,
} from '../../../domain';
import { UseCaseException } from 'src/shared/application/exceptions';

@CommandHandler(UpdateDepartmentCommand)
export class UpdateDepartmentHandler implements ICommandHandler<UpdateDepartmentCommand> {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(command: UpdateDepartmentCommand): Promise<Department> {
    const department = await this.departmentRepository.findById(
      command.departmentId,
    );
    if (!department) {
      throw new NotFoundException(
        `Department with ID ${command.departmentId} not found`,
      );
    }

    // Validate parent department if provided
    if (command.parentId !== undefined && command.parentId !== null) {
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

    if (command.name !== undefined && command.parentId !== undefined) {
      department.updateDetails(command.name, command.parentId);
    } else if (command.name !== undefined) {
      department.rename(command.name);
    } else if (command.parentId !== undefined) {
      department.moveToParent(command.parentId);
    }

    return this.departmentRepository.save(department);
  }
}
