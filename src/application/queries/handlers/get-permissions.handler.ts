import { Injectable, Inject } from '@nestjs/common';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
} from 'src/domain/identity/permission';

@Injectable()
export class GetPermissionsHandler {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute() {
    return await this.permissionRepository.find();
  }
}
