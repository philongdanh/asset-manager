export class UpdateAssetCategoryCommand {
  constructor(
    public readonly categoryId: string,
    public readonly organizationId: string | null,
    public readonly categoryName: string,
    public readonly code: string,
    public readonly parentId: string | null,
  ) { }
}
