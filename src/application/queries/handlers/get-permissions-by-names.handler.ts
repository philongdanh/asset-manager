import { Injectable, Inject } from '@nestjs/common';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
} from 'src/domain/identity/permission';
import { GetPermissionsByNamesQuery } from '../get-permissions-by-names.query';

@Injectable()
export class GetPermissionsByNamesHandler {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(query: GetPermissionsByNamesQuery) {
    return await this.permissionRepository.findPermissionsByNames(query.names);
  }
}
