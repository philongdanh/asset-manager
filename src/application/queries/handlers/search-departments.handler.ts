import { Injectable, Inject } from '@nestjs/common';
import {
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/domain/identity/department';
import { SearchDepartmentsQuery } from '../search-departments.query';

@Injectable()
export class SearchDepartmentsHandler {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(query: SearchDepartmentsQuery) {
    return await this.departmentRepository.searchDepartments(
      query.organizationId,
      query.query,
      query.limit,
    );
  }
}
