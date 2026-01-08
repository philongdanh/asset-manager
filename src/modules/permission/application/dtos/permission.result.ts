import { Permission } from 'src/modules/permission/domain/entities/permission.entity';
import { Role } from 'src/modules/role/domain/entities/role.entity';

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
