import { AccountingEntryType, ReferenceType } from 'src/domain/finance-accounting/accounting-entry';

export class CreateAccountingEntryCommand {
    constructor(
        public readonly organizationId: string,
        public readonly entryType: AccountingEntryType,
        public readonly amount: number,
        public readonly createdByUserId: string,
        public readonly entryDate?: Date,
        public readonly description?: string | null,
        public readonly assetId?: string | null,
        public readonly referenceType?: ReferenceType | null,
        public readonly referenceId?: string | null,
    ) { }
}
