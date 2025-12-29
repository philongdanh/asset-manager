import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import {
    IAssetTransferRepository,
    AssetTransfer,
    AssetTransferStatus,
    AssetTransferType,
} from '../../../domain';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AssetTransferMapper } from '../mappers/asset-transfer.mapper';

@Injectable()
export class PrismaAssetTransferRepository implements IAssetTransferRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<AssetTransfer | null> {
        const raw = await this.prisma.assetTransfer.findUnique({
            where: { id },
        });
        return raw ? AssetTransferMapper.toDomain(raw) : null;
    }

    async findByAssetId(assetId: string): Promise<AssetTransfer[]> {
        const raws = await this.prisma.assetTransfer.findMany({
            where: { assetId },
            orderBy: { transferDate: 'desc' },
        });
        return raws.map((raw) => AssetTransferMapper.toDomain(raw));
    }

    async findByOrganization(organizationId: string): Promise<AssetTransfer[]> {
        const raws = await this.prisma.assetTransfer.findMany({
            where: { organizationId },
            orderBy: { transferDate: 'desc' },
        });
        return raws.map((raw) => AssetTransferMapper.toDomain(raw));
    }

    async findByDepartment(departmentId: string): Promise<AssetTransfer[]> {
        const raws = await this.prisma.assetTransfer.findMany({
            where: {
                OR: [
                    { fromDepartmentId: departmentId },
                    { toDepartmentId: departmentId },
                ],
            },
            orderBy: { transferDate: 'desc' },
        });
        return raws.map((raw) => AssetTransferMapper.toDomain(raw));
    }

    async findByUser(userId: string): Promise<AssetTransfer[]> {
        const raws = await this.prisma.assetTransfer.findMany({
            where: {
                OR: [{ fromUserId: userId }, { toUserId: userId }],
            },
            orderBy: { transferDate: 'desc' },
        });
        return raws.map((raw) => AssetTransferMapper.toDomain(raw));
    }

    async findByApprover(userId: string): Promise<AssetTransfer[]> {
        const raws = await this.prisma.assetTransfer.findMany({
            where: { approvedByUserId: userId },
            orderBy: { transferDate: 'desc' },
        });
        return raws.map((raw) => AssetTransferMapper.toDomain(raw));
    }

    async findByTransferType(
        organizationId: string,
        transferType: AssetTransferType,
    ): Promise<AssetTransfer[]> {
        const raws = await this.prisma.assetTransfer.findMany({
            where: { organizationId, transferType },
            orderBy: { transferDate: 'desc' },
        });
        return raws.map((raw) => AssetTransferMapper.toDomain(raw));
    }

    async findAll(
        organizationId: string,
        options?: {
            status?: AssetTransferStatus;
            transferType?: AssetTransferType;
            fromDepartmentId?: string;
            toDepartmentId?: string;
            fromUserId?: string;
            toUserId?: string;
            startDate?: Date;
            endDate?: Date;
            limit?: number;
            offset?: number;
            includeAssetInfo?: boolean;
        },
    ): Promise<{ data: AssetTransfer[]; total: number }> {
        const where: Prisma.AssetTransferWhereInput = { organizationId };

        if (options?.status) where.status = options.status;
        if (options?.transferType) where.transferType = options.transferType;
        if (options?.fromDepartmentId)
            where.fromDepartmentId = options.fromDepartmentId;
        if (options?.toDepartmentId) where.toDepartmentId = options.toDepartmentId;
        if (options?.fromUserId) where.fromUserId = options.fromUserId;
        if (options?.toUserId) where.toUserId = options.toUserId;
        if (options?.startDate && options?.endDate) {
            where.transferDate = {
                gte: options.startDate,
                lte: options.endDate,
            };
        }

        const [data, total] = await Promise.all([
            this.prisma.assetTransfer.findMany({
                where,
                take: options?.limit,
                skip: options?.offset,
                orderBy: { transferDate: 'desc' },
            }),
            this.prisma.assetTransfer.count({ where }),
        ]);

        return {
            data: data.map((raw) => AssetTransferMapper.toDomain(raw)),
            total,
        };
    }

    async existsById(id: string): Promise<boolean> {
        const count = await this.prisma.assetTransfer.count({ where: { id } });
        return count > 0;
    }

    async hasActiveTransfer(assetId: string): Promise<boolean> {
        const count = await this.prisma.assetTransfer.count({
            where: {
                assetId,
                status: AssetTransferStatus.IN_PROGRESS,
            },
        });
        return count > 0;
    }

    async hasPendingTransfer(assetId: string): Promise<boolean> {
        const count = await this.prisma.assetTransfer.count({
            where: {
                assetId,
                status: AssetTransferStatus.PENDING,
            },
        });
        return count > 0;
    }

    async save(transfer: AssetTransfer): Promise<AssetTransfer> {
        const { data } = AssetTransferMapper.toPersistence(transfer);
        const raw = await this.prisma.assetTransfer.create({ data });
        return AssetTransferMapper.toDomain(raw);
    }

    async update(transfer: AssetTransfer): Promise<AssetTransfer> {
        const { data } = AssetTransferMapper.toPersistence(transfer);
        const raw = await this.prisma.assetTransfer.update({
            where: { id: transfer.id },
            data,
        });
        return AssetTransferMapper.toDomain(raw);
    }

    async saveMany(transfers: AssetTransfer[]): Promise<void> {
        const data = transfers.map(
            (t) => AssetTransferMapper.toPersistence(t).data,
        );
        await this.prisma.$transaction(
            data.map((d) => this.prisma.assetTransfer.create({ data: d })),
        );
    }

    async delete(id: string): Promise<void> {
        await this.prisma.assetTransfer.delete({ where: { id } });
    }

    async deleteMany(ids: string[]): Promise<void> {
        await this.prisma.assetTransfer.deleteMany({ where: { id: { in: ids } } });
    }

    async findByStatusAndDateRange(
        organizationId: string,
        status: AssetTransferStatus,
        startDate: Date,
        endDate: Date,
    ): Promise<AssetTransfer[]> {
        const raws = await this.prisma.assetTransfer.findMany({
            where: {
                organizationId,
                status,
                transferDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        return raws.map((r) => AssetTransferMapper.toDomain(r));
    }

    async getTransfersSummary(
        organizationId: string,
        startDate?: Date,
        endDate?: Date,
    ): Promise<{
        totalCount: number;
        byStatus: Record<AssetTransferStatus, number>;
        byType: Record<AssetTransferType, number>;
        byDepartment: Record<string, { incoming: number; outgoing: number }>;
        byUser: Record<string, { incoming: number; outgoing: number }>;
    }> {
        const where: Prisma.AssetTransferWhereInput = { organizationId };
        if (startDate && endDate) {
            where.transferDate = { gte: startDate, lte: endDate };
        }

        const transfers = await this.prisma.assetTransfer.findMany({
            where,
            select: {
                status: true,
                transferType: true,
                fromDepartmentId: true,
                toDepartmentId: true,
                fromUserId: true,
                toUserId: true,
            },
        });

        const result = {
            totalCount: transfers.length,
            byStatus: {} as Record<AssetTransferStatus, number>,
            byType: {} as Record<AssetTransferType, number>,
            byDepartment: {} as Record<
                string,
                { incoming: number; outgoing: number }
            >,
            byUser: {} as Record<string, { incoming: number; outgoing: number }>,
        };

        // Initialize Enums
        Object.values(AssetTransferStatus).forEach((s) => (result.byStatus[s] = 0));
        Object.values(AssetTransferType).forEach((t) => (result.byType[t] = 0));

        for (const t of transfers) {
            // Status
            result.byStatus[t.status as AssetTransferStatus]++;
            // Type
            result.byType[t.transferType as AssetTransferType]++;

            // Departments
            if (t.fromDepartmentId) {
                if (!result.byDepartment[t.fromDepartmentId])
                    result.byDepartment[t.fromDepartmentId] = {
                        incoming: 0,
                        outgoing: 0,
                    };
                result.byDepartment[t.fromDepartmentId].outgoing++;
            }
            if (t.toDepartmentId) {
                if (!result.byDepartment[t.toDepartmentId])
                    result.byDepartment[t.toDepartmentId] = { incoming: 0, outgoing: 0 };
                result.byDepartment[t.toDepartmentId].incoming++;
            }

            // Users
            if (t.fromUserId) {
                if (!result.byUser[t.fromUserId])
                    result.byUser[t.fromUserId] = { incoming: 0, outgoing: 0 };
                result.byUser[t.fromUserId].outgoing++;
            }
            if (t.toUserId) {
                if (!result.byUser[t.toUserId])
                    result.byUser[t.toUserId] = { incoming: 0, outgoing: 0 };
                result.byUser[t.toUserId].incoming++;
            }
        }

        return result as any;
    }

    async findRecentTransfers(
        organizationId: string,
        limit: number,
    ): Promise<AssetTransfer[]> {
        const raws = await this.prisma.assetTransfer.findMany({
            where: { organizationId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
        return raws.map((r) => AssetTransferMapper.toDomain(r));
    }

    async getTransferActivity(
        organizationId: string,
        startDate: Date,
        endDate: Date,
    ): Promise<
        Array<{
            date: string;
            count: number;
            completed: number;
            pending: number;
        }>
    > {
        const raws = await this.prisma.$queryRaw<any[]>`
        SELECT 
            DATE(transfer_date) as date,
            COUNT(*) as count,
            SUM(CASE WHEN status = ${AssetTransferStatus.COMPLETED} THEN 1 ELSE 0 END) as completed,
            SUM(CASE WHEN status = ${AssetTransferStatus.PENDING} THEN 1 ELSE 0 END) as pending
        FROM "AssetTransfer"
        WHERE organization_id = ${organizationId}
          AND transfer_date >= ${startDate}
          AND transfer_date <= ${endDate}
        GROUP BY DATE(transfer_date)
        ORDER BY date ASC
    `;

        return raws.map((r) => ({
            date: new Date(r.date).toISOString().split('T')[0],
            count: Number(r.count),
            completed: Number(r.completed),
            pending: Number(r.pending),
        }));
    }
}
