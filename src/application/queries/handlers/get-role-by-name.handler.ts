import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  ROLE_REPOSITORY,
  type IRoleRepository,
  Role,
} from 'src/domain/identity/role';
import { GetRoleByNameQuery } from '../get-role-by-name.query';

@Injectable()
export class GetRoleByNameHandler {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(query: GetRoleByNameQuery): Promise<Role> {
    const role = await this.roleRepository.findByName(
      query.organizationId,
      query.roleName,
    );

    if (!role) {
      throw new UseCaseException(
        `Role with name ${query.roleName} not found in organization ${query.organizationId}`,
        GetRoleByNameQuery.name,
      );
    }

    return role;
  }
}
