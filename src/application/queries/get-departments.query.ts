export class GetDepartmentsQuery {
  constructor(
    public readonly organizationId: string,
    public readonly options?: {
      parentId?: string | null;
      limit?: number;
      offset?: number;
      includeDeleted?: boolean;
      search?: string;
    },
  ) {}
}
