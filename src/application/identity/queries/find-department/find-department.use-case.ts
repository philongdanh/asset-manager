import { Injectable, Inject } from '@nestjs/common';
import {
  Department,
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/domain/identity/department';
import { FindDepartmentQuery } from './find-department.query';

@Injectable()
export class FindDepartmentUseCase {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(query: FindDepartmentQuery): Promise<Department | null> {
    return await this.departmentRepository.findById(query.departmentId);
  }
}
