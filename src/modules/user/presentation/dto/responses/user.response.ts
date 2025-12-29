import { Exclude, Expose } from 'class-transformer';
import { UserStatus } from '../../../domain';

@Exclude()
export class UserResponse {
  @Expose({ name: 'id' })
  id: string;

  @Expose({ name: 'organization_id' })
  organizationId: string;

  @Expose({ name: 'department_id' })
  departmentId: string | null;

  @Expose({ name: 'username' })
  username: string;

  @Expose({ name: 'email' })
  email: string;

  @Expose({ name: 'status' })
  status: UserStatus;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  @Expose({ name: 'deleted_at' })
  deletedAt: Date | null;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}
