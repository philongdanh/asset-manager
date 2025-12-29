export class UpdateAssetCategoryCommand {
    constructor(
        public readonly categoryId: string,
        public readonly categoryName: string,
        public readonly code: string,
        public readonly parentId: string | null,
    ) { }
}
