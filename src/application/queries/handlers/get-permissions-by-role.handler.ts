import { Injectable, Inject } from '@nestjs/common';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
} from 'src/domain/identity/permission';
import { GetPermissionsByRoleQuery } from '../get-permissions-by-role.query';

@Injectable()
export class GetPermissionsByRoleHandler {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(query: GetPermissionsByRoleQuery) {
    return await this.permissionRepository.findByRole(query.roleId);
  }
}
