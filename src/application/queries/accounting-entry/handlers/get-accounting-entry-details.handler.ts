import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
    ACCOUNTING_ENTRY_REPOSITORY,
    type IAccountingEntryRepository,
    AccountingEntry,
} from 'src/domain/finance-accounting/accounting-entry';
import { GetAccountingEntryDetailsQuery } from '../get-accounting-entry-details.query';

@Injectable()
export class GetAccountingEntryDetailsHandler {
    constructor(
        @Inject(ACCOUNTING_ENTRY_REPOSITORY)
        private readonly repository: IAccountingEntryRepository,
    ) { }

    async execute(query: GetAccountingEntryDetailsQuery): Promise<AccountingEntry> {
        const entry = await this.repository.findById(query.id);
        if (!entry) {
            throw new UseCaseException('Accounting entry not found', 'GetAccountingEntryDetailsQuery');
        }
        return entry;
    }
}
