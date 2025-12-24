import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  Department,
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/domain/identity/department';
import { GetDepartmentPathQuery } from '../get-department-path.query';

@Injectable()
export class GetDepartmentPathHandler {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(query: GetDepartmentPathQuery): Promise<Department[]> {
    const department = await this.departmentRepository.findById(
      query.departmentId,
    );

    if (!department) {
      throw new UseCaseException(
        `Department with ID ${query.departmentId} not found`,
        GetDepartmentPathQuery.name,
      );
    }

    return await this.departmentRepository.getDepartmentPath(
      query.departmentId,
    );
  }
}
