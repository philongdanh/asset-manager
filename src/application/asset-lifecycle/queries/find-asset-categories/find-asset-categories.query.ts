export class FindAssetCategoriesQuery {
  constructor(
    public readonly organizationId: string,
    public readonly limit?: number,
    public readonly offset?: number,
  ) {}
}
