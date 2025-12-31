import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRolesQuery } from './get-roles.query';
import { ROLE_REPOSITORY, type IRoleRepository, Role } from '../../../domain';

@QueryHandler(GetRolesQuery)
export class GetRolesHandler implements IQueryHandler<GetRolesQuery> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(
    query: GetRolesQuery,
  ): Promise<{ data: Role[]; total: number }> {
    return this.roleRepository.find(query.organizationId);
  }
}
