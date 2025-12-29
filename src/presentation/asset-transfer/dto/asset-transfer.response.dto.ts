import { AssetTransferStatus, AssetTransferType } from 'src/domain/asset-lifecycle/asset-transfer';

export class AssetTransferResponse {
    id: string;
    assetId: string;
    organizationId: string;
    transferDate: Date;
    transferType: AssetTransferType;
    fromDepartmentId: string | null;
    toDepartmentId: string | null;
    fromUserId: string | null;
    toUserId: string | null;
    approvedByUserId: string | null;
    reason: string | null;
    status: AssetTransferStatus;
    createdAt: Date;
    updatedAt: Date;
}
