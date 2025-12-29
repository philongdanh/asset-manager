import { Injectable, Inject } from '@nestjs/common';
import { ID_GENERATOR, type IIdGenerator } from 'src/domain/core/interfaces';
import {
    ACCOUNTING_ENTRY_REPOSITORY,
    type IAccountingEntryRepository,
    AccountingEntry,
} from 'src/modules/accounting-entry/domain';
import { CreateAccountingEntryCommand } from './create-accounting-entry.command';

@Injectable()
export class CreateAccountingEntryHandler {
    constructor(
        @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
        @Inject(ACCOUNTING_ENTRY_REPOSITORY)
        private readonly repository: IAccountingEntryRepository,
    ) { }

    async execute(cmd: CreateAccountingEntryCommand): Promise<AccountingEntry> {
        const id = this.idGenerator.generate();
        const builder = AccountingEntry.builder(
            id,
            cmd.organizationId,
            cmd.entryType,
            cmd.amount,
            cmd.createdByUserId,
        )
            .withDescription(cmd.description || null)
            .forAsset(cmd.assetId || null)
            .withReference(cmd.referenceType || null, cmd.referenceId || null);

        if (cmd.entryDate) {
            builder.onDate(cmd.entryDate);
        }

        const entry = builder.build();
        return await this.repository.save(entry);
    }
}
