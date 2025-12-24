import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  ROLE_REPOSITORY,
  type IRoleRepository,
  Role,
} from 'src/domain/identity/role';
import { GetRoleByIdQuery } from '../get-role-by-id.query';

@Injectable()
export class GetRoleByIdHandler {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(query: GetRoleByIdQuery): Promise<Role> {
    const role = await this.roleRepository.findById(query.roleId);

    if (!role) {
      throw new UseCaseException(
        `Role with ID ${query.roleId} not found`,
        GetRoleByIdQuery.name,
      );
    }

    return role;
  }
}
