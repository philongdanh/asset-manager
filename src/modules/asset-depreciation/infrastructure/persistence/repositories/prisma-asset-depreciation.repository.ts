import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import {
    IAssetDepreciationRepository,
    AssetDepreciation,
    DepreciationMethod,
} from '../../../domain';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AssetDepreciationMapper } from '../mappers/asset-depreciation.mapper';

@Injectable()
export class PrismaAssetDepreciationRepository implements IAssetDepreciationRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<AssetDepreciation | null> {
        const raw = await this.prisma.assetDepreciation.findUnique({
            where: { id },
        });
        return raw ? AssetDepreciationMapper.toDomain(raw) : null;
    }

    async findByAssetId(assetId: string): Promise<AssetDepreciation[]> {
        const raws = await this.prisma.assetDepreciation.findMany({
            where: { assetId },
            orderBy: { depreciationDate: 'desc' },
        });
        return raws.map((r) => AssetDepreciationMapper.toDomain(r));
    }

    async findByOrganization(
        organizationId: string,
    ): Promise<AssetDepreciation[]> {
        const raws = await this.prisma.assetDepreciation.findMany({
            where: { organizationId },
            orderBy: { depreciationDate: 'desc' },
        });
        return raws.map((r) => AssetDepreciationMapper.toDomain(r));
    }

    async findByAccountingEntry(
        accountingEntryId: string,
    ): Promise<AssetDepreciation | null> {
        const raw = await this.prisma.assetDepreciation.findFirst({
            where: { accountingEntryId },
        });
        return raw ? AssetDepreciationMapper.toDomain(raw) : null;
    }

    async findByMethod(
        organizationId: string,
        method: DepreciationMethod,
    ): Promise<AssetDepreciation[]> {
        const raws = await this.prisma.assetDepreciation.findMany({
            where: { organizationId, method },
            orderBy: { depreciationDate: 'desc' },
        });
        return raws.map((r) => AssetDepreciationMapper.toDomain(r));
    }

    async findAll(
        organizationId: string,
        options?: {
            method?: DepreciationMethod;
            assetId?: string;
            startDate?: Date;
            endDate?: Date;
            minValue?: number;
            maxValue?: number;
            limit?: number;
            offset?: number;
        },
    ): Promise<{ data: AssetDepreciation[]; total: number }> {
        const where: Prisma.AssetDepreciationWhereInput = { organizationId };

        if (options?.method) where.method = options.method;
        if (options?.assetId) where.assetId = options.assetId;
        if (options?.startDate && options?.endDate) {
            where.depreciationDate = { gte: options.startDate, lte: options.endDate };
        }
        if (options?.minValue !== undefined) {
            where.depreciationValue = { gte: options.minValue };
        }
        if (options?.maxValue !== undefined) {
            where.depreciationValue = {
                ...((where.depreciationValue as object) || {}),
                lte: options.maxValue,
            };
        }

        const [data, total] = await Promise.all([
            this.prisma.assetDepreciation.findMany({
                where,
                take: options?.limit,
                skip: options?.offset,
                orderBy: { depreciationDate: 'desc' },
            }),
            this.prisma.assetDepreciation.count({ where }),
        ]);

        return {
            data: data.map((r) => AssetDepreciationMapper.toDomain(r)),
            total,
        };
    }

    async findLatestByAssetId(
        assetId: string,
    ): Promise<AssetDepreciation | null> {
        const raw = await this.prisma.assetDepreciation.findFirst({
            where: { assetId },
            orderBy: { depreciationDate: 'desc' },
        });
        return raw ? AssetDepreciationMapper.toDomain(raw) : null;
    }

    async findByDateRange(
        assetId: string,
        startDate: Date,
        endDate: Date,
    ): Promise<AssetDepreciation[]> {
        const raws = await this.prisma.assetDepreciation.findMany({
            where: {
                assetId,
                depreciationDate: { gte: startDate, lte: endDate },
            },
            orderBy: { depreciationDate: 'asc' },
        });
        return raws.map((r) => AssetDepreciationMapper.toDomain(r));
    }

    async existsById(id: string): Promise<boolean> {
        const count = await this.prisma.assetDepreciation.count({ where: { id } });
        return count > 0;
    }

    async existsByDateAndAsset(assetId: string, date: Date): Promise<boolean> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const count = await this.prisma.assetDepreciation.count({
            where: {
                assetId,
                depreciationDate: { gte: startOfDay, lte: endOfDay },
            },
        });
        return count > 0;
    }

    async save(depreciation: AssetDepreciation): Promise<AssetDepreciation> {
        const { data } = AssetDepreciationMapper.toPersistence(depreciation);
        const raw = await this.prisma.assetDepreciation.create({ data });
        return AssetDepreciationMapper.toDomain(raw);
    }

    async update(depreciation: AssetDepreciation): Promise<AssetDepreciation> {
        const { data } = AssetDepreciationMapper.toPersistence(depreciation);
        const raw = await this.prisma.assetDepreciation.update({
            where: { id: depreciation.id },
            data,
        });
        return AssetDepreciationMapper.toDomain(raw);
    }

    async saveMany(depreciations: AssetDepreciation[]): Promise<void> {
        const data = depreciations.map(
            (d) => AssetDepreciationMapper.toPersistence(d).data,
        );
        await this.prisma.$transaction(
            data.map((d) => this.prisma.assetDepreciation.create({ data: d })),
        );
    }

    async delete(id: string): Promise<void> {
        await this.prisma.assetDepreciation.delete({ where: { id } });
    }

    async deleteMany(ids: string[]): Promise<void> {
        await this.prisma.assetDepreciation.deleteMany({
            where: { id: { in: ids } },
        });
    }

    async deleteByAssetId(assetId: string): Promise<void> {
        await this.prisma.assetDepreciation.deleteMany({ where: { assetId } });
    }

    async deleteByAccountingEntry(accountingEntryId: string): Promise<void> {
        await this.prisma.assetDepreciation.deleteMany({
            where: { accountingEntryId },
        });
    }

    async getDepreciationSummary(
        organizationId: string,
        fiscalYear?: number,
    ): Promise<{
        totalDepreciation: number;
        totalAssets: number;
        byMethod: Record<DepreciationMethod, { count: number; value: number }>;
        byMonth: Array<{ month: string; count: number; totalValue: number }>;
    }> {
        const where: Prisma.AssetDepreciationWhereInput = { organizationId };
        if (fiscalYear) {
            const startDate = new Date(fiscalYear, 0, 1);
            const endDate = new Date(fiscalYear, 11, 31, 23, 59, 59);
            where.depreciationDate = { gte: startDate, lte: endDate };
        }

        const depreciations = await this.prisma.assetDepreciation.findMany({
            where,
            select: {
                method: true,
                depreciationValue: true,
                assetId: true,
                depreciationDate: true,
            },
        });

        const result = {
            totalDepreciation: 0,
            totalAssets: new Set<string>(),
            byMethod: {} as Record<
                DepreciationMethod,
                { count: number; value: number }
            >,
            byMonth: [] as Array<{
                month: string;
                count: number;
                totalValue: number;
            }>,
        };

        Object.values(DepreciationMethod).forEach(
            (m) => (result.byMethod[m] = { count: 0, value: 0 }),
        );
        const monthlyMap = new Map<string, { count: number; totalValue: number }>();

        for (const d of depreciations) {
            const value = Number(d.depreciationValue);
            result.totalDepreciation += value;
            result.totalAssets.add(d.assetId);
            result.byMethod[d.method as DepreciationMethod].count++;
            result.byMethod[d.method as DepreciationMethod].value += value;

            const monthKey = `${d.depreciationDate.getFullYear()}-${String(d.depreciationDate.getMonth() + 1).padStart(2, '0')}`;
            const existing = monthlyMap.get(monthKey) || { count: 0, totalValue: 0 };
            monthlyMap.set(monthKey, {
                count: existing.count + 1,
                totalValue: existing.totalValue + value,
            });
        }

        result.byMonth = Array.from(monthlyMap.entries())
            .map(([month, data]) => ({ month, ...data }))
            .sort((a, b) => a.month.localeCompare(b.month));

        return {
            totalDepreciation: result.totalDepreciation,
            totalAssets: result.totalAssets.size,
            byMethod: result.byMethod,
            byMonth: result.byMonth,
        };
    }

    async getAssetDepreciationHistory(assetId: string): Promise<{
        totalDepreciation: number;
        remainingValue: number;
        depreciations: AssetDepreciation[];
        yearlyBreakdown: Array<{
            year: number;
            depreciation: number;
            accumulated: number;
            remaining: number;
        }>;
    }> {
        const depreciations = await this.findByAssetId(assetId);
        const latest = depreciations[0];

        const yearlyMap = new Map<
            number,
            { depreciation: number; accumulated: number; remaining: number }
        >();
        for (const d of depreciations) {
            const year = d.depreciationDate.getFullYear();
            yearlyMap.set(year, {
                depreciation:
                    (yearlyMap.get(year)?.depreciation || 0) + d.depreciationValue,
                accumulated: d.accumulatedDepreciation,
                remaining: d.remainingValue,
            });
        }

        return {
            totalDepreciation: depreciations.reduce(
                (sum, d) => sum + d.depreciationValue,
                0,
            ),
            remainingValue: latest?.remainingValue || 0,
            depreciations,
            yearlyBreakdown: Array.from(yearlyMap.entries())
                .map(([year, data]) => ({ year, ...data }))
                .sort((a, b) => a.year - b.year),
        };
    }

    async findDepreciationsWithoutAccountingEntry(
        organizationId: string,
    ): Promise<AssetDepreciation[]> {
        const raws = await this.prisma.assetDepreciation.findMany({
            where: { organizationId, accountingEntryId: null },
            orderBy: { depreciationDate: 'desc' },
        });
        return raws.map((r) => AssetDepreciationMapper.toDomain(r));
    }

    async getMonthlyDepreciationReport(
        organizationId: string,
        year: number,
        month: number,
    ): Promise<{
        totalDepreciation: number;
        byAssetCategory: Record<string, number>;
        byDepartment: Record<string, number>;
        topDepreciatingAssets: Array<{
            assetId: string;
            assetName: string;
            depreciationValue: number;
        }>;
    }> {
        // Simplified implementation
        return {
            totalDepreciation: 0,
            byAssetCategory: {},
            byDepartment: {},
            topDepreciatingAssets: [],
        };
    }

    async getDepreciationsByAssetIds(
        assetIds: string[],
    ): Promise<Record<string, AssetDepreciation[]>> {
        const raws = await this.prisma.assetDepreciation.findMany({
            where: { assetId: { in: assetIds } },
            orderBy: { depreciationDate: 'desc' },
        });

        const result: Record<string, AssetDepreciation[]> = {};
        for (const id of assetIds) {
            result[id] = [];
        }
        for (const r of raws) {
            result[r.assetId].push(AssetDepreciationMapper.toDomain(r));
        }
        return result;
    }
}
