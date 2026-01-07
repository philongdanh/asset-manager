import { Exclude, Expose } from 'class-transformer';
import { Permission } from '../../../../permission/domain/entities/permission.entity';
import { PermissionResponse } from '../../../../permission/presentation/dto/responses/permission.response';
import { Role } from '../../../domain';

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

  constructor(role: Role, permissions: Permission[]) {
    this.id = role.id;
    this.name = role.name;
    this.organizationId = role.organizationId;
    this.createdAt = role.createdAt!;
    this.updatedAt = role.updatedAt!;
    this.permissions = permissions.map((p) => new PermissionResponse(p));
  }
}
