import { AssetCondition, AssetStatus } from 'src/domain/asset-lifecycle/asset';

export class AssetResponse {
    id: string;
    organizationId: string;
    assetCode: string;
    assetName: string;
    categoryId: string;
    createdByUserId: string;
    purchasePrice: number;
    originalCost: number;
    currentValue: number;
    status: AssetStatus;
    currentDepartmentId: string | null;
    currentUserId: string | null;
    model: string | null;
    serialNumber: string | null;
    manufacturer: string | null;
    purchaseDate: Date | null;
    warrantyExpiryDate: Date | null;
    location: string | null;
    specifications: string | null;
    condition: AssetCondition | null;
    createdAt: Date;
    updatedAt: Date;
}
