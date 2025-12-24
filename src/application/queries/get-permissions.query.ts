export class GetPermissionsQuery {
  constructor(
    public readonly options?: {
      search?: string;
      module?: string;
      systemOnly?: boolean;
      limit?: number;
      offset?: number;
      includeDeleted?: boolean;
    },
  ) {}
}
