import { Injectable, Inject } from '@nestjs/common';
import {
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/domain/identity/department';
import { GetDepartmentTreeQuery } from '../get-department-tree.query';

@Injectable()
export class GetDepartmentTreeHandler {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(query: GetDepartmentTreeQuery) {
    return await this.departmentRepository.getDepartmentTree(
      query.organizationId,
    );
  }
}
