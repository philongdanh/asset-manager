import {
    AssetDepreciation,
    DepreciationMethod,
} from 'src/domain/finance-accounting/asset-depreciation';
import { AssetDepreciation as PrismaAssetDepreciation, Prisma } from 'generated/prisma/client';

export class AssetDepreciationMapper {
    static toDomain(raw: PrismaAssetDepreciation): AssetDepreciation {
        const builder = AssetDepreciation.builder(
            raw.id,
            raw.assetId,
            raw.organizationId,
            raw.method as DepreciationMethod,
        )
            .atDate(raw.depreciationDate)
            .withValues(
                Number(raw.depreciationValue),
                Number(raw.accumulatedDepreciation),
                Number(raw.remainingValue),
            )
            .withAccountingEntry(raw.accountingEntryId)
            .withTimestamps(raw.createdAt, raw.updatedAt);

        return builder.build();
    }

    static toPersistence(domain: AssetDepreciation): {
        data: Omit<PrismaAssetDepreciation, 'createdAt' | 'updatedAt'>;
    } {
        return {
            data: {
                id: domain.id,
                assetId: domain.assetId,
                organizationId: domain.organizationId,
                depreciationDate: domain.depreciationDate,
                method: domain.method,
                depreciationValue: new Prisma.Decimal(domain.depreciationValue),
                accumulatedDepreciation: new Prisma.Decimal(domain.accumulatedDepreciation),
                remainingValue: new Prisma.Decimal(domain.remainingValue),
                accountingEntryId: domain.accountingEntryId,
            },
        };
    }
}
