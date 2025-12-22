import { Injectable, Inject } from '@nestjs/common';
import {
  Department,
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/domain/modules/department';
import {
  type IOrganizationRepository,
  Organization,
  ORGANIZATION_REPOSITORY,
} from 'src/domain/modules/organization';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';
import { CommandValidationException } from '../../../exceptions/command-validation.exception';
import { EntityNotFoundException } from 'src/domain/core/exceptions/entity-not-found.exception';
import { CreateDepartmentCommand } from './create-department.command';

@Injectable()
export class CreateDepartmentUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(command: CreateDepartmentCommand): Promise<Department> {
    if (!command.name) {
      throw new CommandValidationException(
        [
          {
            field: 'name',
            message: 'Name is required.',
            rejectedValue: command.name,
          },
        ],
        CreateDepartmentCommand.name,
      );
    }

    const existingOrganization = await this.organizationRepository.findById(
      command.organizationId,
    );
    if (!existingOrganization) {
      throw new EntityNotFoundException(
        Organization.name,
        command.organizationId,
      );
    }

    if (command.parentId) {
      const existingParent = await this.departmentRepository.findById(
        command.parentId,
      );
      if (existingParent) {
        throw new EntityNotFoundException(Department.name, command.parentId);
      }
    }

    const id = this.idGenerator.generate();
    const newDepartment = Department.create(
      id,
      command.organizationId,
      command.name,
      command.parentId,
    );
    return await this.departmentRepository.save(newDepartment);
  }
}
