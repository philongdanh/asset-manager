export class AssetCategoryResponse {
    id: string;
    organizationId: string;
    code: string;
    categoryName: string;
    parentId: string | null;
    createdAt: Date;
    updatedAt: Date;
}
