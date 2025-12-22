export class FindAssetCategoryQuery {
  constructor(
    public readonly organizationId: string,
    public readonly categoryId: string,
  ) {}
}
