import { Injectable, Inject } from '@nestjs/common';
import { DeleteDepartmentCommand } from './delete-department.command';
import {
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/domain/identity/department';

@Injectable()
export class DeleteDepartmentUseCase {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(command: DeleteDepartmentCommand): Promise<void> {
    await this.departmentRepository.deleteById(command.departmentId);
  }
}
