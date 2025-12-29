import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import {
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
  Department,
} from '../../../domain';
import { CreateDepartmentCommand } from './create-department.command';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateDepartmentCommand)
export class CreateDepartmentHandler implements ICommandHandler<CreateDepartmentCommand> {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepo: IDepartmentRepository,
  ) {}

  async execute(cmd: CreateDepartmentCommand): Promise<Department> {
    if (cmd.parentId) {
      const parentDepartment = await this.departmentRepo.findById(cmd.parentId);
      if (!parentDepartment) {
        throw new UseCaseException(
          `Parent department with ID ${cmd.parentId} not found`,
          CreateDepartmentCommand.name,
        );
      }
    }

    const id = this.idGenerator.generate();
    const department = Department.builder(id, cmd.orgId, cmd.name)
      .withParent(cmd.parentId)
      .build();
    return await this.departmentRepo.save(department);
  }
}
