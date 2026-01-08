import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRoleDetailsQuery } from './get-role-details.query';
import { ROLE_REPOSITORY, type IRoleRepository } from '../../../domain';
import { PERMISSION_REPOSITORY } from '../../../../permission/domain/repositories/permission.repository.interface';
import type { IPermissionRepository } from '../../../../permission/domain/repositories/permission.repository.interface';
import { RoleResult } from '../../dtos';

@QueryHandler(GetRoleDetailsQuery)
export class GetRoleDetailsHandler implements IQueryHandler<GetRoleDetailsQuery, RoleResult> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) { }

  async execute(query: GetRoleDetailsQuery): Promise<RoleResult> {
    const role = await this.roleRepository.findById(query.roleId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${query.roleId} not found`);
    }

    const permissions = await this.permissionRepository.findByRoles([role.id]);

    return new RoleResult(role, permissions, []);
  }
}

