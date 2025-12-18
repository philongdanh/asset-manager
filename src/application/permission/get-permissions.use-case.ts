import { Injectable, Inject } from '@nestjs/common';
import {
  PERMISSION_REPOSITORY,
  Permission,
  type IPermissionRepository,
} from 'src/domain/permission';

@Injectable()
export class GetPermissionsUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(): Promise<Permission[]> {
    return this.permissionRepository.findAll();
  }
}
