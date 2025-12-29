export class CreateAssetCategoryCommand {
    constructor(
        public readonly organizationId: string,
        public readonly code: string,
        public readonly categoryName: string,
        public readonly parentId: string | null,
    ) { }
}
