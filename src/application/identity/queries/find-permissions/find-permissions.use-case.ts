import { Injectable, Inject } from '@nestjs/common';
import {
  PERMISSION_REPOSITORY,
  Permission,
  type IPermissionRepository,
} from 'src/domain/identity/permission';

@Injectable()
export class FindPermissionsUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }
}
