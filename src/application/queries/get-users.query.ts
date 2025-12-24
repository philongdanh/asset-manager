export class GetUsersQuery {
  constructor(
    public readonly organizationId: string,
    public readonly options?: {
      departmentId?: string;
      status?: string;
      roleId?: string;
      search?: string;
      limit?: number;
      offset?: number;
      includeDeleted?: boolean;
    },
  ) {}
}
