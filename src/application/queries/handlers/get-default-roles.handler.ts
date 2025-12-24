import { Injectable, Inject } from '@nestjs/common';
import {
  ROLE_REPOSITORY,
  type IRoleRepository,
} from 'src/domain/identity/role';
import { GetRolesWithUserCountQuery } from '../get-roles-with-user-count.query';

@Injectable()
export class GetRolesWithUserCountHandler {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(query: GetRolesWithUserCountQuery) {
    return await this.roleRepository.findRolesWithUserCount(
      query.organizationId,
    );
  }
}
