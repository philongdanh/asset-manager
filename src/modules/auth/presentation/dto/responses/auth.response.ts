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
}

export class AuthResponse {
  @Expose({ name: 'access_token' })
  accessToken: string;

  @Expose({ name: 'refresh_token' })
  refreshToken: string;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  constructor(partial: Partial<AuthResponse>) {
    Object.assign(this, partial);
  }
}
