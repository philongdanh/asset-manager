export interface GetAssetCategoriesQuery {
  organizationId: string;
  options: {
    limit?: number;
    offset?: number;
    includeDeleted?: boolean;
  };
}
