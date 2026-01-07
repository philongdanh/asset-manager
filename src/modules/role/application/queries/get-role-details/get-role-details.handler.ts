import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRoleDetailsQuery } from './get-role-details.query';
import { ROLE_REPOSITORY, type IRoleRepository, Role } from '../../../domain';

@QueryHandler(GetRoleDetailsQuery)
export class GetRoleDetailsHandler implements IQueryHandler<GetRoleDetailsQuery> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) { }

  async execute(query: GetRoleDetailsQuery): Promise<Role> {
    const role = await this.roleRepository.findById(query.roleId, query.organizationId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${query.roleId} not found`);
    }
    return role;
  }
}
