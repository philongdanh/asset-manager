export class CreateAssetCategoryCommand {
  constructor(
    public readonly organizationId: string,
    public readonly name: string,
    public readonly code: string,
    public readonly parentId: string | null,
    public readonly subCategoryIds: string[] = [],
  ) {}
}
