import { AssetStatus } from '../../../domain/entities/asset.entity';

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
