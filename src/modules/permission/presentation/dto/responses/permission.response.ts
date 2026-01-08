import { Exclude, Expose } from 'class-transformer';
import {
  PermissionListResult,
  PermissionResult,
} from 'src/modules/permission/application/dtos/permission.result';
import { RoleResult } from 'src/modules/role/application/dtos/role.result';
import { RoleResponse } from 'src/modules/role/presentation/dto/responses/role.response';

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

  constructor(result: PermissionResult) {
    this.id = result.permission.id;
    this.name = result.permission.name;
    this.description = result.permission.description;
    this.roles = result.roles?.map((r) => new RoleResponse(new RoleResult(r)));
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
