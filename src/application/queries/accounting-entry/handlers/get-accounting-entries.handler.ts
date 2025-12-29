import { Injectable, Inject } from '@nestjs/common';
import {
  ACCOUNTING_ENTRY_REPOSITORY,
  type IAccountingEntryRepository,
  AccountingEntry,
} from 'src/domain/finance-accounting/accounting-entry';
import { GetAccountingEntriesQuery } from '../get-accounting-entries.query';

@Injectable()
export class GetAccountingEntriesHandler {
  constructor(
    @Inject(ACCOUNTING_ENTRY_REPOSITORY)
    private readonly repository: IAccountingEntryRepository,
  ) {}

  async execute(
    query: GetAccountingEntriesQuery,
  ): Promise<{ data: AccountingEntry[]; total: number }> {
    return await this.repository.findAll(query.organizationId, query.options);
  }
}
