import { AccountingEntryType, ReferenceType } from 'src/domain/finance-accounting/accounting-entry';

export class GetAccountingEntriesQuery {
    constructor(
        public readonly organizationId: string,
        public readonly options: {
            entryType?: AccountingEntryType;
            assetId?: string;
            referenceType?: ReferenceType;
            referenceId?: string;
            startDate?: Date;
            endDate?: Date;
            limit?: number;
            offset?: number;
        } = {},
    ) { }
}
