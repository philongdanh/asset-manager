import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DepartmentResponse {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose({ name: 'organization_id' })
    organizationId: string;

    @Expose({ name: 'parent_id' })
    parentId: string | null;

    @Expose({ name: 'created_at' })
    createdAt: Date;

    @Expose({ name: 'updated_at' })
    updatedAt: Date;

    constructor(partial: Partial<DepartmentResponse>) {
        Object.assign(this, partial);
    }
}
