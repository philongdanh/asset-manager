import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRoleDetailsQuery } from './get-role-details.query';
import { ROLE_REPOSITORY, type IRoleRepository } from '../../../domain';
import { PERMISSION_REPOSITORY } from '../../../../permission/domain/repositories/permission.repository.interface';
import type { IPermissionRepository } from '../../../../permission/domain/repositories/permission.repository.interface';
import { RoleResult } from '../../dtos';
import { EntityNotFoundException } from 'src/shared/domain';
import { type IUserRepository, USER_REPOSITORY } from 'src/modules/user';

@QueryHandler(GetRoleDetailsQuery)
export class GetRoleDetailsHandler implements IQueryHandler<
  GetRoleDetailsQuery,
  RoleResult
> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permRepo: IPermissionRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(query: GetRoleDetailsQuery): Promise<RoleResult> {
    const role = await this.roleRepo.findById(query.id);
    if (!role) {
      throw new EntityNotFoundException(
        `Role with ID ${query.id} not found`,
        GetRoleDetailsHandler.name,
      );
    }

    const [permissions, users] = await Promise.all([
      this.permRepo.findByRoles([role.id]),
      this.userRepo.findByRole(role.id),
    ]);

    return new RoleResult(role, permissions, users);
  }
}
