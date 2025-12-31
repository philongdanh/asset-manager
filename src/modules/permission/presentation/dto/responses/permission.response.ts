import { Exclude, Expose } from 'class-transformer';
import { Permission } from '../../../domain';

@Exclude()
export class PermissionResponse {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string | null;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  constructor(permission: Permission) {
    this.id = permission.id;
    this.name = permission.name;
    this.description = permission.description;
    this.createdAt = permission.createdAt!;
    this.updatedAt = permission.updatedAt!;
  }
}
