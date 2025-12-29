import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AssetCategoryResponse {
    @Expose()
    id: string;

    @Expose({ name: 'organization_id' })
    organizationId: string;

    @Expose()
    code: string;

    @Expose({ name: 'category_name' })
    categoryName: string;

    @Expose({ name: 'parent_id' })
    parentId: string | null;

    @Expose({ name: 'created_at' })
    createdAt: Date;

    @Expose({ name: 'updated_at' })
    updatedAt: Date;

    constructor(partial: Partial<AssetCategoryResponse>) {
        Object.assign(this, partial);
    }
}
