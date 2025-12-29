import {
    AssetDisposal,
    AssetDisposalStatus,
    AssetDisposalType,
} from './asset-disposal.entity';

export const ASSET_DISPOSAL_REPOSITORY = Symbol('ASSET_DISPOSAL_REPOSITORY');

export interface IAssetDisposalRepository {
    // --- Query Methods ---

    findById(id: string): Promise<AssetDisposal | null>;

    findByAssetId(assetId: string): Promise<AssetDisposal[]>;

    findByOrganization(organizationId: string): Promise<AssetDisposal[]>;

    findByApprover(userId: string): Promise<AssetDisposal[]>;

    findByAccountingEntry(
        accountingEntryId: string,
    ): Promise<AssetDisposal | null>;

    findAll(
        organizationId: string,
        options?: {
            status?: AssetDisposalStatus;
            disposalType?: AssetDisposalType;
            startDate?: Date;
            endDate?: Date;
            limit?: number;
            offset?: number;
            includeAssetInfo?: boolean;
        },
    ): Promise<{ data: AssetDisposal[]; total: number }>;

    // --- Validation Methods ---

    existsById(id: string): Promise<boolean>;

    hasPendingDisposal(assetId: string): Promise<boolean>;

    hasApprovedDisposal(assetId: string): Promise<boolean>;

    // --- Persistence Methods ---

    save(disposal: AssetDisposal): Promise<AssetDisposal>;

    update(disposal: AssetDisposal): Promise<AssetDisposal>;

    saveMany(disposals: AssetDisposal[]): Promise<void>;

    delete(id: string): Promise<void>;

    deleteMany(ids: string[]): Promise<void>;

    // --- Special Methods ---

    findByStatusAndDateRange(
        organizationId: string,
        status: AssetDisposalStatus,
        startDate: Date,
        endDate: Date,
    ): Promise<AssetDisposal[]>;

    getDisposalSummary(
        organizationId: string,
        fiscalYear?: number,
    ): Promise<{
        totalCount: number;
        totalValue: number;
        byType: Record<AssetDisposalType, { count: number; value: number }>;
        byStatus: Record<AssetDisposalStatus, number>;
    }>;
}
