import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDepartmentsQuery } from './get-departments.query';
import {
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
  Department,
} from '../../../domain';

@QueryHandler(GetDepartmentsQuery)
export class GetDepartmentsHandler implements IQueryHandler<GetDepartmentsQuery> {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(
    query: GetDepartmentsQuery,
  ): Promise<{ data: Department[]; total: number }> {
    return this.departmentRepository.find(query.organizationId, query.options);
  }
}
