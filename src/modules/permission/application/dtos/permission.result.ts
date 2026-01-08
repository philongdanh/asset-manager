import { Permission } from 'src/modules/permission';
import { Role } from 'src/modules/role';

export class PermissionResult {
  constructor(
    public readonly permission: Permission,
    public readonly roles?: Role[],
  ) {}
}

export class PermissionListResult {
  constructor(
    public readonly total: number,
    public readonly data: PermissionResult[],
  ) {}
}
