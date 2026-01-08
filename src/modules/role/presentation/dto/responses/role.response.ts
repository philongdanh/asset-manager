import { Exclude, Expose } from 'class-transformer';
import {
  RoleListResult,
  RoleResult,
} from '../../../application/dtos/role.result';
import { PermissionResponse } from 'src/modules/permission';
import { UserResponse } from 'src/modules/user';
import { PermissionResult } from 'src/modules/permission/application/dtos';

@Exclude()
export class RoleResponse {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  @Expose()
  permissions?: PermissionResponse[];

  @Expose()
  users?: UserResponse[];

  constructor(result: RoleResult) {
    this.id = result.role.id;
    this.name = result.role.name;
    this.createdAt = result.role.createdAt!;
    this.updatedAt = result.role.updatedAt!;
    this.permissions = result.permissions?.map(
      (p) => new PermissionResponse(new PermissionResult(p)),
    );
    this.users = result.users?.map((u) => new UserResponse(u));
  }
}

@Exclude()
export class RoleListResponse {
  @Expose()
  total: number;

  @Expose()
  data: RoleResponse[];

  constructor(roles: RoleListResult) {
    this.total = roles.total;
    this.data = roles.data.map((role) => new RoleResponse(role));
  }
}
