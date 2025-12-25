import { UserStatus } from 'src/domain/identity/user';

export class GetUsersQuery {
  constructor(
    public readonly organizationId: string,
    public readonly options?: {
      departmentId?: string;
      status?: UserStatus;
      roleId?: string;
      search?: string;
      limit?: number;
      offset?: number;
      includeDeleted?: boolean;
    },
  ) {}
}
