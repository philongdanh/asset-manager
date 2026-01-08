import { Role } from '../../domain/entities/role.entity';
import { Permission } from 'src/modules/permission';
import { User } from 'src/modules/user';

export class RoleResult {
  constructor(
    public readonly role: Role,
    public readonly permissions?: Permission[],
    public readonly users?: User[],
  ) {}
}

export class RoleListResult {
  constructor(
    public readonly total: number,
    public readonly data: RoleResult[],
  ) {}
}
