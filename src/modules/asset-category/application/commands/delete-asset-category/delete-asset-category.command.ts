export class DeleteAssetCategoryCommand {
  constructor(
    public readonly categoryId: string,
    public readonly organizationId: string | null,
  ) { }
}
