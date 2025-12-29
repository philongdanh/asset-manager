import { Exclude, Expose } from 'class-transformer';

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

  constructor(partial: Partial<RoleResponse>) {
    Object.assign(this, partial);
  }
}
