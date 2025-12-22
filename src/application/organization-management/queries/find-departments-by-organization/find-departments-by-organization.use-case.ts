import { Injectable, Inject } from '@nestjs/common';
import {
  Department,
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/domain/modules/department';
import {
  Organization,
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from 'src/domain/modules/organization';
import { FindDepartmentsByOrganizationQuery } from './find-departments-by-organization.query';
import { EntityNotFoundException } from 'src/domain/core';

@Injectable()
export class FindDepartmentsByOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(
    query: FindDepartmentsByOrganizationQuery,
  ): Promise<Department[]> {
    const existingOrganization = await this.organizationRepository.findById(
      query.organizationId,
    );
    if (!existingOrganization) {
      throw new EntityNotFoundException(
        Organization.name,
        query.organizationId,
      );
    }

    return await this.departmentRepository.findByOrganization(
      query.organizationId,
    );
  }
}
