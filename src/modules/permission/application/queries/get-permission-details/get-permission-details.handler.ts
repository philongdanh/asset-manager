import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPermissionDetailsQuery } from './get-permission-details.query';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
} from 'src/modules/permission/domain/repositories/permission.repository.interface';
import { PermissionResult } from 'src/modules/permission/application/dtos/permission.result';
import { EntityNotFoundException } from 'src/shared/domain/exceptions/entity-not-found.exception';
import {
  ROLE_REPOSITORY,
  type IRoleRepository,
} from 'src/modules/role/domain/repositories/role.repository.interface';

@QueryHandler(GetPermissionDetailsQuery)
export class GetPermissionDetailsHandler implements IQueryHandler<
  GetPermissionDetailsQuery,
  PermissionResult
> {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permRepo: IPermissionRepository,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
  ) {}

  async execute(query: GetPermissionDetailsQuery): Promise<PermissionResult> {
    const perm = await this.permRepo.findById(query.id);
    if (!perm) {
      throw new EntityNotFoundException(
        `Permission with ID ${query.id} not found`,
        GetPermissionDetailsHandler.name,
      );
    }
    const roles = await this.roleRepo.findByPerms([perm.id]);
    return new PermissionResult(perm, roles);
  }
}
