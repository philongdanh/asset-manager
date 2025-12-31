export class GetDepartmentsQuery {
  constructor(
    public readonly organizationId: string,
    public readonly options?: {
      parentId?: string | null;
      includeDeleted?: boolean;
    },
  ) {}
}
