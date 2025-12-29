import {
    AssetTransferStatus,
    AssetTransferType,
} from '../../../domain';

export class GetAssetTransfersQuery {
    organizationId: string;
    options: {
        status?: AssetTransferStatus;
        transferType?: AssetTransferType;
        fromDepartmentId?: string;
        toDepartmentId?: string;
        fromUserId?: string;
        toUserId?: string;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
        offset?: number;
        includeAssetInfo?: boolean;
    };
}
