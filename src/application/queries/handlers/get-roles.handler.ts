import { Injectable, Inject } from '@nestjs/common';
import {
  ROLE_REPOSITORY,
  type IRoleRepository,
} from 'src/domain/identity/role';
import { GetRolesQuery } from '../get-roles.query';

@Injectable()
export class GetRolesHandler {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(query: GetRolesQuery) {
    return await this.roleRepository.findAll(
      query.organizationId,
      query.options,
    );
  }
}
