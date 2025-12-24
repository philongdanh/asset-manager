import { Injectable, Inject } from '@nestjs/common';
import {
  ROLE_REPOSITORY,
  type IRoleRepository,
} from 'src/domain/identity/role';
import { GetRolesByUserQuery } from '../get-roles-by-user.query';

@Injectable()
export class GetRolesByUserHandler {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(query: GetRolesByUserQuery) {
    return await this.roleRepository.findByUserId(query.userId);
  }
}
