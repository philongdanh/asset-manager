import { Inject } from '@nestjs/common';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
  Permission,
} from '../../../domain';

import { GetPermissionsQuery } from './get-permissions.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PermissionListResult, PermissionResult } from '../../dtos';

@QueryHandler(GetPermissionsQuery)
export class GetPermissionsHandler implements IQueryHandler<
  GetPermissionsQuery,
  PermissionListResult
> {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permRepo: IPermissionRepository,
  ) {}

  async execute(): Promise<PermissionListResult> {
    const perms = await this.permRepo.find();
    return new PermissionListResult(
      perms.length,
      perms.map((perm) => new PermissionResult(perm)),
    );
  }
}
