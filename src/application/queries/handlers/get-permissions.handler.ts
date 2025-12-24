import { Injectable, Inject } from '@nestjs/common';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
} from 'src/domain/identity/permission';
import { GetPermissionsQuery } from '../get-permissions.query';

@Injectable()
export class GetPermissionsHandler {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(query: GetPermissionsQuery) {
    return await this.permissionRepository.findAll(query.options);
  }
}
