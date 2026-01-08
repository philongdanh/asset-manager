import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RoleResult, RoleListResult } from '../../dtos/role.result';
import { GetRolesQuery } from './get-roles.query';
import {
  ROLE_REPOSITORY,
  type IRoleRepository,
} from '../../../domain/repositories/role.repository.interface';

@QueryHandler(GetRolesQuery)
export class GetRolesHandler implements IQueryHandler<
  GetRolesQuery,
  RoleListResult
> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
  ) {}

  async execute(): Promise<RoleListResult> {
    const roles = await this.roleRepo.find();
    return new RoleListResult(
      roles.length,
      roles.map((role) => new RoleResult(role)),
    );
  }
}
