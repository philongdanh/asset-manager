import { Exclude, Expose } from 'class-transformer';
import { PermissionResponse } from '../../../../permission/presentation/dto/responses/permission.response';
import { RoleResult } from '../../../application';

@Exclude()
export class RoleResponse {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose({ name: 'organization_id' })
  organizationId: string;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  @Expose()
  permissions: PermissionResponse[];

  constructor(result: RoleResult) {
    this.id = result.role.id;
    this.name = result.role.name;
    this.organizationId = result.role.organizationId;
    this.createdAt = result.role.createdAt!;
    this.updatedAt = result.role.updatedAt!;
    this.permissions = result.permissions.map((p) => new PermissionResponse(p));
  }
}

