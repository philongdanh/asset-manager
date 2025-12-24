import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  Department,
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/domain/identity/department';
import { GetDepartmentByIdQuery } from '../get-department-by-id.query';

@Injectable()
export class GetDepartmentByIdHandler {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(query: GetDepartmentByIdQuery): Promise<Department> {
    const department = await this.departmentRepository.findById(
      query.departmentId,
    );

    if (!department) {
      throw new UseCaseException(
        `Department with ID ${query.departmentId} not found`,
        GetDepartmentByIdQuery.name,
      );
    }

    return department;
  }
}
