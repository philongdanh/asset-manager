import { Exclude, Expose } from 'class-transformer';
import { User, UserStatus } from '../../../domain';

@Exclude()
export class UserResponse {
  @Expose({ name: 'id' })
  id: string;

  @Expose({ name: 'department_id' })
  departmentId: string | null;

  @Expose({ name: 'username' })
  username: string;

  @Expose({ name: 'email' })
  email: string;

  @Expose({ name: 'status' })
  status: UserStatus;

  @Expose({ name: 'avatar_url' })
  avatarUrl: string | null;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.departmentId = user.departmentId;
    this.username = user.username;
    this.email = user.email;
    this.status = user.status;
    this.avatarUrl = user.avatarUrl;
    this.createdAt = user.createdAt!;
    this.updatedAt = user.updatedAt!;
  }
}
