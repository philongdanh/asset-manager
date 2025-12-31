import { Exclude, Expose } from 'class-transformer';
import { User, UserStatus } from '../../../domain';

@Exclude()
export class UserResponse {
  @Expose({ name: 'id' })
  id: string;

  @Expose({ name: 'organization_id' })
  organizationId: string | null;

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

  @Expose({ name: 'deleted_at' })
  deletedAt: Date | null;

  constructor(user: User) {
    this.id = user.id;
    this.organizationId = user.organizationId!; // optional in domain but DTO expects string. Root admin check might fail here if null.
    // Wait, UserResponse defines organizationId as string (not nullable). 
    // If I map root user (orgId=null), this will crash or type error.
    // I should probably make organizationId nullable in Response or handle it safely.
    // Given previous context, root admin has null orgId. 
    // I will check if DTO allows null.
    // Line 10: organizationId: string; -> It does NOT allow null.
    // I will update it to string | null.

    this.organizationId = user.organizationId!;
    this.departmentId = user.departmentId;
    this.username = user.username;
    this.email = user.email;
    this.status = user.status;
    this.avatarUrl = user.avatarUrl;
    this.createdAt = user.createdAt!;
    this.updatedAt = user.updatedAt!;
    this.deletedAt = user.deletedAt || null;
  }
}
