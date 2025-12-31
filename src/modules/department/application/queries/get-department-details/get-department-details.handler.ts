import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDepartmentDetailsQuery } from './get-department-details.query';
import {
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
  Department,
} from '../../../domain';

@QueryHandler(GetDepartmentDetailsQuery)
export class GetDepartmentDetailsHandler implements IQueryHandler<GetDepartmentDetailsQuery> {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(query: GetDepartmentDetailsQuery): Promise<Department> {
    const department = await this.departmentRepository.findById(
      query.departmentId,
    );
    if (!department) {
      throw new NotFoundException(
        `Department with ID ${query.departmentId} not found`,
      );
    }
    return department;
  }
}
