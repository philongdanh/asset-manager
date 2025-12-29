import { Prisma, AccountingEntry as PrismaAccountingEntry } from 'generated/prisma/client';
import {
    AccountingEntry,
    AccountingEntryType,
    ReferenceType,
} from 'src/domain/finance-accounting/accounting-entry';

export class AccountingEntryMapper {
    static toDomain(raw: PrismaAccountingEntry): AccountingEntry {
        const builder = AccountingEntry.builder(
            raw.id,
            raw.organizationId,
            raw.entryType as AccountingEntryType,
            raw.amount.toNumber(),
            raw.createdByUserId,
        )
            .onDate(raw.entryDate)
            .withDescription(raw.description)
            .forAsset(raw.assetId)
            .withReference(
                raw.referenceType as ReferenceType | null,
                raw.referenceId,
            )
            .withTimestamps(raw.createdAt, raw.updatedAt);

        return builder.build();
    }

    static toPersistence(
        entry: AccountingEntry,
    ): Prisma.AccountingEntryCreateArgs {
        return {
            data: {
                id: entry.id,
                organizationId: entry.organizationId,
                entryType: entry.entryType,
                entryDate: entry.entryDate,
                amount: entry.amount,
                description: entry.description,
                assetId: entry.assetId,
                referenceId: entry.referenceId,
                referenceType: entry.referenceType,
                createdByUserId: entry.createdByUserId,
                createdAt: entry.createdAt,
                updatedAt: entry.updatedAt,
            },
        };
    }
}
