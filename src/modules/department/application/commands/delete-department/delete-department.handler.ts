import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteDepartmentCommand } from './delete-department.command';
import {
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from '../../../domain';

@CommandHandler(DeleteDepartmentCommand)
export class DeleteDepartmentHandler implements ICommandHandler<DeleteDepartmentCommand> {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(command: DeleteDepartmentCommand): Promise<void> {
    const exists = await this.departmentRepository.existsById(
      command.departmentId,
    );
    if (!exists) {
      throw new NotFoundException(
        `Department with ID ${command.departmentId} not found`,
      );
    }

    await this.departmentRepository.delete([command.departmentId]);
  }
}
