import { Injectable, Inject } from '@nestjs/common';
import {
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/domain/identity/department';
import { GetDepartmentsQuery } from '../get-departments.query';

@Injectable()
export class GetDepartmentsHandler {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(query: GetDepartmentsQuery) {
    return await this.departmentRepository.find(
      query.organizationId,
      query.options,
    );
  }
}
