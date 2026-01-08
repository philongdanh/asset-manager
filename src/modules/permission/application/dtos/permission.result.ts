import { Permission } from 'src/modules/permission';
import { Role } from 'src/modules/role';
import { User } from 'src/modules/user';

export class PermissionResult {
  constructor(
    public readonly permission: Permission,
    public readonly roles?: Role[],
    public readonly users?: User[],
  ) {}
}

export class PermissionListResult {
  constructor(
    public readonly total: number,
    public readonly data: PermissionResult[],
  ) {}
}
