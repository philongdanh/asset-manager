import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import {
    IAccountingEntryRepository,
    AccountingEntry,
    AccountingEntryType,
    ReferenceType,
} from 'src/modules/accounting-entry/domain';
import { AccountingEntryMapper } from '../mappers/accounting-entry.mapper';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class PrismaAccountingEntryRepository implements IAccountingEntryRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<AccountingEntry | null> {
        const raw = await this.prisma.accountingEntry.findUnique({
            where: { id },
        });
        return raw ? AccountingEntryMapper.toDomain(raw) : null;
    }

    async findByOrganization(organizationId: string): Promise<AccountingEntry[]> {
        const raws = await this.prisma.accountingEntry.findMany({
            where: { organizationId },
            orderBy: { entryDate: 'desc' },
        });
        return raws.map((raw) => AccountingEntryMapper.toDomain(raw));
    }

    async findByAssetId(assetId: string): Promise<AccountingEntry[]> {
        const raws = await this.prisma.accountingEntry.findMany({
            where: { assetId },
            orderBy: { entryDate: 'desc' },
        });
        return raws.map((raw) => AccountingEntryMapper.toDomain(raw));
    }

    async findByEntryType(
        organizationId: string,
        entryType: AccountingEntryType,
    ): Promise<AccountingEntry[]> {
        const raws = await this.prisma.accountingEntry.findMany({
            where: { organizationId, entryType },
            orderBy: { entryDate: 'desc' },
        });
        return raws.map((raw) => AccountingEntryMapper.toDomain(raw));
    }

    async findByReference(
        referenceType: ReferenceType,
        referenceId: string,
    ): Promise<AccountingEntry | null> {
        const raw = await this.prisma.accountingEntry.findFirst({
            where: { referenceType, referenceId },
        });
        return raw ? AccountingEntryMapper.toDomain(raw) : null;
    }

    async findByCreatedBy(userId: string): Promise<AccountingEntry[]> {
        const raws = await this.prisma.accountingEntry.findMany({
            where: { createdByUserId: userId },
            orderBy: { entryDate: 'desc' },
        });
        return raws.map((raw) => AccountingEntryMapper.toDomain(raw));
    }

    async findAll(
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
    ): Promise<{ data: AccountingEntry[]; total: number }> {
        const where: Prisma.AccountingEntryWhereInput = {
            organizationId,
        };

        if (options?.entryType) where.entryType = options.entryType;
        if (options?.assetId) where.assetId = options.assetId;
        if (options?.referenceType) where.referenceType = options.referenceType;
        if (options?.referenceId) where.referenceId = options.referenceId;
        if (options?.createdByUserId)
            where.createdByUserId = options.createdByUserId;

        if (options?.startDate || options?.endDate) {
            where.entryDate = {};
            if (options.startDate) where.entryDate.gte = options.startDate;
            if (options.endDate) where.entryDate.lte = options.endDate;
        }

        if (options?.minAmount || options?.maxAmount) {
            where.amount = {};
            if (options.minAmount) where.amount.gte = options.minAmount;
            if (options.maxAmount) where.amount.lte = options.maxAmount;
        }

        const [raws, total] = await Promise.all([
            this.prisma.accountingEntry.findMany({
                where,
                take: options?.limit,
                skip: options?.offset,
                orderBy: { entryDate: 'desc' },
                include: options?.includeAssetInfo ? { asset: true } : undefined,
            }),
            this.prisma.accountingEntry.count({ where }),
        ]);

        return {
            data: raws.map((raw) => AccountingEntryMapper.toDomain(raw)),
            total,
        };
    }

    async existsById(id: string): Promise<boolean> {
        const count = await this.prisma.accountingEntry.count({ where: { id } });
        return count > 0;
    }

    async save(entry: AccountingEntry): Promise<AccountingEntry> {
        const { data } = AccountingEntryMapper.toPersistence(entry);
        const raw = await this.prisma.accountingEntry.create({ data });
        return AccountingEntryMapper.toDomain(raw);
    }

    async update(entry: AccountingEntry): Promise<AccountingEntry> {
        const { data } = AccountingEntryMapper.toPersistence(entry);
        const raw = await this.prisma.accountingEntry.update({
            where: { id: entry.id },
            data,
        });
        return AccountingEntryMapper.toDomain(raw);
    }

    async saveMany(entries: AccountingEntry[]): Promise<void> {
        await this.prisma.$transaction(
            entries.map((entry) => {
                const { data } = AccountingEntryMapper.toPersistence(entry);
                return this.prisma.accountingEntry.create({ data });
            }),
        );
    }

    async delete(id: string): Promise<void> {
        await this.prisma.accountingEntry.delete({ where: { id } });
    }

    async deleteMany(ids: string[]): Promise<void> {
        await this.prisma.accountingEntry.deleteMany({
            where: { id: { in: ids } },
        });
    }

    async deleteByAssetId(assetId: string): Promise<void> {
        await this.prisma.accountingEntry.deleteMany({ where: { assetId } });
    }

    async deleteByReference(
        referenceType: ReferenceType,
        referenceId: string,
    ): Promise<void> {
        await this.prisma.accountingEntry.deleteMany({
            where: { referenceType, referenceId },
        });
    }

    async getFinancialSummary(
        organizationId: string,
        startDate?: Date,
        endDate?: Date,
    ): Promise<{
        totalEntries: number;
        totalAmount: number;
        byEntryType: Record<AccountingEntryType, { count: number; amount: number }>;
        byAsset: Record<string, { count: number; amount: number }>;
        byMonth: Array<{ month: string; count: number; amount: number }>;
    }> {
        const where: Prisma.AccountingEntryWhereInput = { organizationId };
        if (startDate || endDate) {
            where.entryDate = {};
            if (startDate) where.entryDate.gte = startDate;
            if (endDate) where.entryDate.lte = endDate;
        }

        const raws = await this.prisma.accountingEntry.findMany({ where });

        const result = {
            totalEntries: raws.length,
            totalAmount: 0,
            byEntryType: {} as Record<
                AccountingEntryType,
                { count: number; amount: number }
            >,
            byAsset: {} as Record<string, { count: number; amount: number }>,
            byMonth: [] as Array<{ month: string; count: number; amount: number }>,
        };

        // Initialize map for byMonth
        const monthMap = new Map<string, { count: number; amount: number }>();

        for (const raw of raws) {
            const amount = raw.amount.toNumber();
            result.totalAmount += amount;

            // By Entry Type
            const type = raw.entryType as AccountingEntryType;
            if (!result.byEntryType[type])
                result.byEntryType[type] = { count: 0, amount: 0 };
            result.byEntryType[type].count++;
            result.byEntryType[type].amount += amount;

            // By Asset
            if (raw.assetId) {
                if (!result.byAsset[raw.assetId])
                    result.byAsset[raw.assetId] = { count: 0, amount: 0 };
                result.byAsset[raw.assetId].count++;
                result.byAsset[raw.assetId].amount += amount;
            }

            // By Month
            const monthKey = raw.entryDate.toISOString().slice(0, 7); // YYYY-MM
            if (!monthMap.has(monthKey))
                monthMap.set(monthKey, { count: 0, amount: 0 });
            const m = monthMap.get(monthKey)!;
            m.count++;
            m.amount += amount;
        }

        result.byMonth = Array.from(monthMap.entries()).map(([month, data]) => ({
            month,
            count: data.count,
            amount: data.amount,
        }));

        return result;
    }

    async getEntriesByDateRange(
        organizationId: string,
        startDate: Date,
        endDate: Date,
    ): Promise<AccountingEntry[]> {
        const raws = await this.prisma.accountingEntry.findMany({
            where: {
                organizationId,
                entryDate: { gte: startDate, lte: endDate },
            },
            orderBy: { entryDate: 'asc' },
        });
        return raws.map((raw) => AccountingEntryMapper.toDomain(raw));
    }

    async findRecentEntries(
        organizationId: string,
        limit: number,
    ): Promise<AccountingEntry[]> {
        const raws = await this.prisma.accountingEntry.findMany({
            where: { organizationId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
        return raws.map((raw) => AccountingEntryMapper.toDomain(raw));
    }

    async getMonthlySummary(
        organizationId: string,
        year: number,
    ): Promise<
        Array<{
            month: number;
            totalAmount: number;
            entryCount: number;
            byType: Record<AccountingEntryType, number>;
        }>
    > {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);

        const raws = await this.prisma.accountingEntry.findMany({
            where: {
                organizationId,
                entryDate: { gte: startDate, lte: endDate },
            },
        });

        const summaryMap = new Map<
            number,
            {
                totalAmount: number;
                entryCount: number;
                byType: Record<AccountingEntryType, number>;
            }
        >();

        for (let i = 0; i < 12; i++) {
            summaryMap.set(i, {
                totalAmount: 0,
                entryCount: 0,
                byType: {} as Record<AccountingEntryType, number>,
            });
        }

        for (const raw of raws) {
            const month = raw.entryDate.getMonth();
            const data = summaryMap.get(month)!;
            const amount = raw.amount.toNumber();

            data.totalAmount += amount;
            data.entryCount++;

            const type = raw.entryType as AccountingEntryType;
            if (!data.byType[type]) data.byType[type] = 0;
            data.byType[type] += amount;
        }

        return Array.from(summaryMap.entries()).map(([month, data]) => ({
            month: month + 1,
            ...data,
        }));
    }

    async getAssetFinancialHistory(assetId: string): Promise<{
        purchaseAmount: number;
        totalDepreciation: number;
        disposalAmount: number | null;
        maintenanceCost: number;
        otherCosts: number;
    }> {
        const raws = await this.prisma.accountingEntry.findMany({
            where: { assetId },
        });

        const result = {
            purchaseAmount: 0,
            totalDepreciation: 0,
            disposalAmount: null as number | null,
            maintenanceCost: 0,
            otherCosts: 0,
        };

        for (const raw of raws) {
            const amount = raw.amount.toNumber();
            switch (raw.entryType as AccountingEntryType) {
                case AccountingEntryType.ASSET_PURCHASE:
                    result.purchaseAmount += amount;
                    break;
                case AccountingEntryType.DEPRECIATION:
                    result.totalDepreciation += amount;
                    break;
                case AccountingEntryType.DISPOSAL:
                    result.disposalAmount = (result.disposalAmount || 0) + amount;
                    break;
                case AccountingEntryType.MAINTENANCE:
                case AccountingEntryType.REPAIR:
                case AccountingEntryType.UPGRADE:
                    result.maintenanceCost += amount;
                    break;
                default:
                    result.otherCosts += amount;
            }
        }
        return result;
    }

    async getEntriesByAssetIds(
        assetIds: string[],
    ): Promise<Record<string, AccountingEntry[]>> {
        const raws = await this.prisma.accountingEntry.findMany({
            where: { assetId: { in: assetIds } },
            orderBy: { entryDate: 'desc' },
        });

        const result: Record<string, AccountingEntry[]> = {};
        for (const raw of raws) {
            if (raw.assetId) {
                if (!result[raw.assetId]) result[raw.assetId] = [];
                result[raw.assetId].push(AccountingEntryMapper.toDomain(raw));
            }
        }
        return result;
    }
}
