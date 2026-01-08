import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
} from 'src/modules/permission/domain/repositories/permission.repository.interface';
import { GetPermissionsQuery } from './get-permissions.query';
import {
  PermissionListResult,
  PermissionResult,
} from 'src/modules/permission/application/dtos/permission.result';

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
