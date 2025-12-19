import { Injectable, Inject } from '@nestjs/common';
import {
  ROLE_REPOSITORY,
  Role,
  type IRoleRepository,
} from 'src/domain/identity/role';

@Injectable()
export class FindRolesUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(organizationId: string): Promise<Role[]> {
    if (!organizationId) {
      throw new Error('Organization ID is required.');
    }
    return this.roleRepository.find(organizationId);
  }
}
