import { Exclude, Expose } from 'class-transformer';
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

  constructor(role: Role) {
    this.id = role.id;
    this.name = role.name;
    this.organizationId = role.organizationId;
    this.createdAt = role.createdAt!;
    this.updatedAt = role.updatedAt!;
  }
}
