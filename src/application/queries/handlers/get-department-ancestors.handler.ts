import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  Department,
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/domain/identity/department';
import { GetDepartmentAncestorsQuery } from '../get-department-ancestors.query';

@Injectable()
export class GetDepartmentAncestorsHandler {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(query: GetDepartmentAncestorsQuery): Promise<Department[]> {
    const department = await this.departmentRepository.findById(
      query.departmentId,
    );

    if (!department) {
      throw new UseCaseException(
        `Department with ID ${query.departmentId} not found`,
        GetDepartmentAncestorsQuery.name,
      );
    }

    return await this.departmentRepository.getDepartmentAncestors(
      query.departmentId,
    );
  }
}
