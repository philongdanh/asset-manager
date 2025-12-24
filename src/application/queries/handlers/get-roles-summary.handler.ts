import { Injectable, Inject } from '@nestjs/common';
import {
  ROLE_REPOSITORY,
  type IRoleRepository,
} from 'src/domain/identity/role';
import { GetRolesSummaryQuery } from '../get-roles-summary.query';

@Injectable()
export class GetRolesSummaryHandler {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(query: GetRolesSummaryQuery) {
    return await this.roleRepository.getRolesSummary(query.organizationId);
  }
}
