import {
  AccountingEntry,
  AccountingEntryType,
  ReferenceType,
} from './accounting-entry.entity';

export const ACCOUNTING_ENTRY_REPOSITORY = Symbol(
  'ACCOUNTING_ENTRY_REPOSITORY',
);

export interface IAccountingEntryRepository {
  // --- Query Methods ---

  findById(id: string): Promise<AccountingEntry | null>;

  findByOrganization(organizationId: string): Promise<AccountingEntry[]>;

  findByAssetId(assetId: string): Promise<AccountingEntry[]>;

  findByEntryType(
    organizationId: string,
    entryType: AccountingEntryType,
  ): Promise<AccountingEntry[]>;

  findByReference(
    referenceType: ReferenceType,
    referenceId: string,
  ): Promise<AccountingEntry | null>;

  findByCreatedBy(userId: string): Promise<AccountingEntry[]>;

  findAll(
    organizationId: string,
    options?: {
      entryType?: AccountingEntryType;
      assetId?: string;
      referenceType?: ReferenceType;
      referenceId?: string;
      createdByUserId?: string;
      startDate?: Date;
      endDate?: Date;
      minAmount?: number;
      maxAmount?: number;
      limit?: number;
      offset?: number;
      includeAssetInfo?: boolean;
    },
  ): Promise<{ data: AccountingEntry[]; total: number }>;

  // --- Validation Methods ---

  existsById(id: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(entry: AccountingEntry): Promise<AccountingEntry>;

  update(entry: AccountingEntry): Promise<AccountingEntry>;

  saveMany(entries: AccountingEntry[]): Promise<void>;

  delete(id: string): Promise<void>;

  deleteMany(ids: string[]): Promise<void>;

  deleteByAssetId(assetId: string): Promise<void>;

  deleteByReference(
    referenceType: ReferenceType,
    referenceId: string,
  ): Promise<void>;

  // --- Special Methods ---

  getFinancialSummary(
    organizationId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    totalEntries: number;
    totalAmount: number;
    byEntryType: Record<AccountingEntryType, { count: number; amount: number }>;
    byAsset: Record<string, { count: number; amount: number }>;
    byMonth: Array<{
      month: string;
      count: number;
      amount: number;
    }>;
  }>;

  getEntriesByDateRange(
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<AccountingEntry[]>;

  findRecentEntries(
    organizationId: string,
    limit: number,
  ): Promise<AccountingEntry[]>;

  // --- Statistics Methods ---

  getMonthlySummary(
    organizationId: string,
    year: number,
  ): Promise<
    Array<{
      month: number;
      totalAmount: number;
      entryCount: number;
      byType: Record<AccountingEntryType, number>;
    }>
  >;

  getAssetFinancialHistory(assetId: string): Promise<{
    purchaseAmount: number;
    totalDepreciation: number;
    disposalAmount: number | null;
    maintenanceCost: number;
    otherCosts: number;
  }>;

  // --- Bulk Operations ---

  getEntriesByAssetIds(
    assetIds: string[],
  ): Promise<Record<string, AccountingEntry[]>>;
}
