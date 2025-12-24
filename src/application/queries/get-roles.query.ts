export class GetRolesQuery {
  constructor(
    public readonly organizationId: string,
    public readonly options?: {
      search?: string;
      systemOnly?: boolean;
      defaultOnly?: boolean;
      limit?: number;
      offset?: number;
      includeDeleted?: boolean;
    },
  ) {}
}
