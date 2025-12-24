import { Injectable, Inject } from '@nestjs/common';
import {
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/domain/identity/department';
import { GetDepartmentStatsQuery } from '../get-department-stats.query';

@Injectable()
export class GetDepartmentStatsHandler {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(query: GetDepartmentStatsQuery) {
    return await this.departmentRepository.getDepartmentStats(
      query.organizationId,
    );
  }
}
