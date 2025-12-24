import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  Department,
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/domain/identity/department';
import { GetDepartmentByNameQuery } from '../get-department-by-name.query';

@Injectable()
export class GetDepartmentByNameHandler {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(query: GetDepartmentByNameQuery): Promise<Department> {
    const department = await this.departmentRepository.findByName(
      query.organizationId,
      query.name,
    );

    if (!department) {
      throw new UseCaseException(
        `Department with name ${query.name} not found in organization ${query.organizationId}`,
        GetDepartmentByNameQuery.name,
      );
    }

    return department;
  }
}
