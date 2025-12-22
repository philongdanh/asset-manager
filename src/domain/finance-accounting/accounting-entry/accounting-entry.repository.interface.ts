import { AccountingEntry } from './accounting-entry.entity';

export const ACCOUNTING_ENTRY_REPOSITORY = Symbol(
  'ACCOUNTING_ENTRY_REPOSITORY',
);

export interface IAccountingEntryRepository {
  // --- Query Methods ---

  findById(id: string): Promise<AccountingEntry | null>;

  findByAssetId(assetId: string): Promise<AccountingEntry[]>;

  findAll(
    organizationId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      referenceType?: string; // e.g., 'DEPRECIATION', 'DISPOSAL'
      limit?: number;
      offset?: number;
    },
  ): Promise<{ data: AccountingEntry[]; total: number }>;

  findByReference(
    referenceType: string,
    referenceId: string,
  ): Promise<AccountingEntry | null>;

  findByAccount(
    organizationId: string,
    accountCode: string,
  ): Promise<AccountingEntry[]>;

  // --- Persistence Methods ---

  save(entry: AccountingEntry): Promise<AccountingEntry>;

  saveMany(entries: AccountingEntry[]): Promise<void>;

  delete(id: string): Promise<void>;
}
