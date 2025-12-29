import {
  AssetTransfer,
  AssetTransferStatus,
  AssetTransferType,
} from './asset-transfer.entity';

export const ASSET_TRANSFER_REPOSITORY = Symbol('ASSET_TRANSFER_REPOSITORY');

export interface IAssetTransferRepository {
  // --- Query Methods ---

  findById(id: string): Promise<AssetTransfer | null>;

  findByAssetId(assetId: string): Promise<AssetTransfer[]>;

  findByOrganization(organizationId: string): Promise<AssetTransfer[]>;

  findByDepartment(departmentId: string): Promise<AssetTransfer[]>;

  findByUser(userId: string): Promise<AssetTransfer[]>;

  findByApprover(userId: string): Promise<AssetTransfer[]>;

  findByTransferType(
    organizationId: string,
    transferType: AssetTransferType,
  ): Promise<AssetTransfer[]>;

  findAll(
    organizationId: string,
    options?: {
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
    },
  ): Promise<{ data: AssetTransfer[]; total: number }>;

  // --- Validation Methods ---

  existsById(id: string): Promise<boolean>;

  hasActiveTransfer(assetId: string): Promise<boolean>;

  hasPendingTransfer(assetId: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(transfer: AssetTransfer): Promise<AssetTransfer>;

  update(transfer: AssetTransfer): Promise<AssetTransfer>;

  saveMany(transfers: AssetTransfer[]): Promise<void>;

  delete(id: string): Promise<void>;

  deleteMany(ids: string[]): Promise<void>;

  // --- Special Methods ---

  findByStatusAndDateRange(
    organizationId: string,
    status: AssetTransferStatus,
    startDate: Date,
    endDate: Date,
  ): Promise<AssetTransfer[]>;

  getTransfersSummary(
    organizationId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    totalCount: number;
    byStatus: Record<AssetTransferStatus, number>;
    byType: Record<AssetTransferType, number>;
    byDepartment: Record<string, { incoming: number; outgoing: number }>;
    byUser: Record<string, { incoming: number; outgoing: number }>;
  }>;

  findRecentTransfers(
    organizationId: string,
    limit: number,
  ): Promise<AssetTransfer[]>;

  // --- Statistics Methods ---

  getTransferActivity(
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<
    Array<{
      date: string;
      count: number;
      completed: number;
      pending: number;
    }>
  >;
}
