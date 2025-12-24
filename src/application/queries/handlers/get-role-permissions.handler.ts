import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  ROLE_REPOSITORY,
  type IRoleRepository,
} from 'src/domain/identity/role';
import { GetRolePermissionsQuery } from '../get-role-permissions.query';

@Injectable()
export class GetRolePermissionsHandler {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(query: GetRolePermissionsQuery): Promise<string[]> {
    const role = await this.roleRepository.findById(query.roleId);

    if (!role) {
      throw new UseCaseException(
        `Role with ID ${query.roleId} not found`,
        GetRolePermissionsQuery.name,
      );
    }

    return await this.roleRepository.getRolePermissions(query.roleId);
  }
}
