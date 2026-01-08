import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRolesQuery } from './get-roles.query';
import { ROLE_REPOSITORY, type IRoleRepository } from '../../../domain';
import { RoleResult, RoleListResult } from '../../dtos';

@QueryHandler(GetRolesQuery)
export class GetRolesHandler implements IQueryHandler<GetRolesQuery, RoleListResult> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) { }

  async execute(query: GetRolesQuery): Promise<RoleListResult> {
    const { data, total } = await this.roleRepository.find();
    const roleResults = data.map((role) => new RoleResult(role, [], []));
    return new RoleListResult(roleResults, total);
  }
}

