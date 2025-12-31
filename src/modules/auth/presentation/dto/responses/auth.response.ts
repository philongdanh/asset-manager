import { Expose, Type } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose({ name: 'organization_id' })
  organizationId: string;

  @Expose({ name: 'department_id' })
  departmentId: string | null;

  @Expose()
  status: string;

  @Expose()
  roles: string[];

  @Expose()
  permissions: string[];

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  constructor(user: any) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.organizationId = user.organizationId;
    this.departmentId = user.departmentId;
    this.status = user.status;
    this.roles = user.roles;
    this.permissions = user.permissions;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

export class AuthResponse {
  @Expose({ name: 'access_token' })
  accessToken: string;

  @Expose({ name: 'refresh_token' })
  refreshToken: string;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  constructor(accessToken: string, refreshToken: string, user: any) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = new UserDto(user);
  }
}
