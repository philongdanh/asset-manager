import { AssetStatus } from 'src/domain/asset-lifecycle/asset';

export class GetAssetsQuery {
    organizationId: string;
    options: {
        status?: AssetStatus;
        categoryId?: string;
        departmentId?: string;
        userId?: string;
        search?: string;
        limit?: number;
        offset?: number;
        includeDeleted?: boolean;
    };
}
