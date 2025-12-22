import { Injectable, Inject } from '@nestjs/common';
import {
  ROLE_REPOSITORY,
  Role,
  type IRoleRepository,
} from 'src/domain/identity/role';
import { FindRolesQuery } from './find-roles.query';
import { UseCaseException } from 'src/application/core/exceptions/use-case.exception';

@Injectable()
export class FindRolesUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(query: FindRolesQuery): Promise<Role[]> {
    if (!query.organizationId) {
      throw new UseCaseException(
        'Organization ID is required.',
        FindRolesUseCase.name,
      );
    }
    return this.roleRepository.findByOrganization(query.organizationId);
  }
}
