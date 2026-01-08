import { UserStatus } from '../../../domain';

export class GetUsersQuery {
  constructor(
    public readonly organizationId: string | null,
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
