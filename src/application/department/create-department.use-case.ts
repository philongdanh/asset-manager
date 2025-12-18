import { Injectable, Inject } from '@nestjs/common';
import {
  Department,
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/domain/departmenet';
import {
  type IOrgRepository,
  Organization,
  ORGANIZATION_REPOSITORY,
} from 'src/domain/organization';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';
import { CommandValidationException } from '../exceptions/command-validation.exception';
import { EntityNotFoundException } from 'src/domain/exceptions/entity-not-found.exception';

@Injectable()
export class CreateDepartmentUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrgRepository,
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(
    organizationId: string,
    name: string,
    parentId: string | null,
  ): Promise<Department> {
    if (!name) {
      throw new CommandValidationException(
        [
          {
            field: 'name',
            message: 'Name is required.',
            rejectedValue: null,
          },
        ],
        'Create department',
      );
    }

    const existingOrganization =
      await this.organizationRepository.findById(organizationId);
    if (!existingOrganization) {
      throw new EntityNotFoundException(Organization.name, organizationId);
    }

    if (parentId) {
      const existingParent = await this.departmentRepository.findById(parentId);
      if (existingParent) {
        throw new EntityNotFoundException(Department.name, parentId);
      }
    }

    const id = this.idGenerator.generate();
    const newDepartment = Department.create(id, organizationId, name, parentId);
    return this.departmentRepository.save(newDepartment);
  }
}
