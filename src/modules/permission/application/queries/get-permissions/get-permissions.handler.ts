import { Inject } from '@nestjs/common';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
  Permission,
} from '../../../domain';

import { GetPermissionsQuery } from './get-permissions.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetPermissionsQuery)
export class GetPermissionsHandler implements IQueryHandler<GetPermissionsQuery> {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(): Promise<{ data: Permission[]; total: number }> {
    return await this.permissionRepository.find();
  }
}
