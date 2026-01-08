import { Exclude, Expose } from 'class-transformer';
import { Permission } from 'src/modules/permission';
import {
  PermissionListResult,
  PermissionResult,
} from 'src/modules/permission/application/dtos';
import { RoleResponse, RoleResult } from 'src/modules/role';
import { UserResponse } from 'src/modules/user';

@Exclude()
export class PermissionResponse {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string | null;

  @Expose()
  roles?: RoleResponse[];

  @Expose()
  users?: UserResponse[];

  constructor(result: PermissionResult) {
    this.id = result.permission.id;
    this.name = result.permission.name;
    this.description = result.permission.description;
    this.roles = result.roles?.map((r) => new RoleResponse(new RoleResult(r)));
    this.users = result.users?.map((u) => new UserResponse(u));
  }
}

@Exclude()
export class PermissionListRespone {
  @Expose()
  total: number;

  @Expose()
  data: PermissionResponse[];

  constructor(perms: PermissionListResult) {
    this.total = perms.total;
    this.data = perms.data.map((perm) => new PermissionResponse(perm));
  }
}
