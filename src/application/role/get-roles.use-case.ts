import { Injectable, Inject } from '@nestjs/common';
import { ROLE_REPOSITORY, Role, type IRoleRepository } from 'src/domain/role';

@Injectable()
export class GetRolesUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(organizationId: string): Promise<Role[]> {
    if (!organizationId) {
      throw new Error('Organization ID is required.');
    }
    return this.roleRepository.findAll(organizationId);
  }
}
