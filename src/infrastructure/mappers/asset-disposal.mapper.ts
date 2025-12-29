import {
    AssetDisposal,
    AssetDisposalStatus,
    AssetDisposalType,
} from 'src/domain/asset-lifecycle/asset-disposal';
import { AssetDisposal as PrismaAssetDisposal, Prisma } from 'generated/prisma/client';

export class AssetDisposalMapper {
    static toDomain(raw: PrismaAssetDisposal): AssetDisposal {
        const builder = AssetDisposal.builder(
            raw.id,
            raw.assetId,
            raw.organizationId,
            raw.disposalType as AssetDisposalType,
        )
            .atDate(raw.disposalDate)
            .withValue(Number(raw.disposalValue))
            .withReason(raw.reason)
            .approvedBy(raw.approvedByUserId)
            .withStatus(raw.status as AssetDisposalStatus)
            .withAccountingEntry(raw.accountingEntryId)
            .withTimestamps(raw.createdAt, raw.updatedAt);

        return builder.build();
    }

    static toPersistence(domain: AssetDisposal): {
        data: Omit<PrismaAssetDisposal, 'createdAt' | 'updatedAt'>;
    } {
        return {
            data: {
                id: domain.id,
                assetId: domain.assetId,
                organizationId: domain.organizationId,
                disposalDate: domain.disposalDate,
                disposalType: domain.disposalType,
                disposalValue: new Prisma.Decimal(domain.disposalValue),
                reason: domain.reason,
                approvedByUserId: domain.approvedByUserId,
                status: domain.status,
                accountingEntryId: domain.accountingEntryId,
            },
        };
    }
}
