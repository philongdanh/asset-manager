import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import {
  IAssetDisposalRepository,
  AssetDisposal,
  AssetDisposalStatus,
  AssetDisposalType,
} from 'src/domain/asset-lifecycle/asset-disposal';
import { PrismaService } from '../prisma.service';
import { AssetDisposalMapper } from 'src/infrastructure/mappers/asset-disposal.mapper';

@Injectable()
export class PrismaAssetDisposalRepository implements IAssetDisposalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<AssetDisposal | null> {
    const raw = await this.prisma.assetDisposal.findUnique({
      where: { id },
    });
    return raw ? AssetDisposalMapper.toDomain(raw) : null;
  }

  async findByAssetId(assetId: string): Promise<AssetDisposal[]> {
    const raws = await this.prisma.assetDisposal.findMany({
      where: { assetId },
      orderBy: { disposalDate: 'desc' },
    });
    return raws.map((raw) => AssetDisposalMapper.toDomain(raw));
  }

  async findByOrganization(organizationId: string): Promise<AssetDisposal[]> {
    const raws = await this.prisma.assetDisposal.findMany({
      where: { organizationId },
      orderBy: { disposalDate: 'desc' },
    });
    return raws.map((raw) => AssetDisposalMapper.toDomain(raw));
  }

  async findByApprover(userId: string): Promise<AssetDisposal[]> {
    const raws = await this.prisma.assetDisposal.findMany({
      where: { approvedByUserId: userId },
      orderBy: { disposalDate: 'desc' },
    });
    return raws.map((raw) => AssetDisposalMapper.toDomain(raw));
  }

  async findByAccountingEntry(
    accountingEntryId: string,
  ): Promise<AssetDisposal | null> {
    const raw = await this.prisma.assetDisposal.findFirst({
      where: { accountingEntryId },
    });
    return raw ? AssetDisposalMapper.toDomain(raw) : null;
  }

  async findAll(
    organizationId: string,
    options?: {
      status?: AssetDisposalStatus;
      disposalType?: AssetDisposalType;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
      includeAssetInfo?: boolean;
    },
  ): Promise<{ data: AssetDisposal[]; total: number }> {
    const where: Prisma.AssetDisposalWhereInput = { organizationId };

    if (options?.status) where.status = options.status;
    if (options?.disposalType) where.disposalType = options.disposalType;
    if (options?.startDate && options?.endDate) {
      where.disposalDate = {
        gte: options.startDate,
        lte: options.endDate,
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.assetDisposal.findMany({
        where,
        take: options?.limit,
        skip: options?.offset,
        orderBy: { disposalDate: 'desc' },
      }),
      this.prisma.assetDisposal.count({ where }),
    ]);

    return {
      data: data.map((raw) => AssetDisposalMapper.toDomain(raw)),
      total,
    };
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.assetDisposal.count({ where: { id } });
    return count > 0;
  }

  async hasPendingDisposal(assetId: string): Promise<boolean> {
    const count = await this.prisma.assetDisposal.count({
      where: {
        assetId,
        status: AssetDisposalStatus.PENDING,
      },
    });
    return count > 0;
  }

  async hasApprovedDisposal(assetId: string): Promise<boolean> {
    const count = await this.prisma.assetDisposal.count({
      where: {
        assetId,
        status: AssetDisposalStatus.APPROVED,
      },
    });
    return count > 0;
  }

  async save(disposal: AssetDisposal): Promise<AssetDisposal> {
    const { data } = AssetDisposalMapper.toPersistence(disposal);
    const raw = await this.prisma.assetDisposal.create({ data });
    return AssetDisposalMapper.toDomain(raw);
  }

  async update(disposal: AssetDisposal): Promise<AssetDisposal> {
    const { data } = AssetDisposalMapper.toPersistence(disposal);
    const raw = await this.prisma.assetDisposal.update({
      where: { id: disposal.id },
      data,
    });
    return AssetDisposalMapper.toDomain(raw);
  }

  async saveMany(disposals: AssetDisposal[]): Promise<void> {
    const data = disposals.map(
      (d) => AssetDisposalMapper.toPersistence(d).data,
    );
    await this.prisma.$transaction(
      data.map((d) => this.prisma.assetDisposal.create({ data: d })),
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.assetDisposal.delete({ where: { id } });
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.prisma.assetDisposal.deleteMany({ where: { id: { in: ids } } });
  }

  async findByStatusAndDateRange(
    organizationId: string,
    status: AssetDisposalStatus,
    startDate: Date,
    endDate: Date,
  ): Promise<AssetDisposal[]> {
    const raws = await this.prisma.assetDisposal.findMany({
      where: {
        organizationId,
        status,
        disposalDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    return raws.map((r) => AssetDisposalMapper.toDomain(r));
  }

  async getDisposalSummary(
    organizationId: string,
    fiscalYear?: number,
  ): Promise<{
    totalCount: number;
    totalValue: number;
    byType: Record<AssetDisposalType, { count: number; value: number }>;
    byStatus: Record<AssetDisposalStatus, number>;
  }> {
    const where: Prisma.AssetDisposalWhereInput = { organizationId };
    if (fiscalYear) {
      const startDate = new Date(fiscalYear, 0, 1);
      const endDate = new Date(fiscalYear, 11, 31, 23, 59, 59);
      where.disposalDate = { gte: startDate, lte: endDate };
    }

    const disposals = await this.prisma.assetDisposal.findMany({
      where,
      select: {
        status: true,
        disposalType: true,
        disposalValue: true,
      },
    });

    const result = {
      totalCount: disposals.length,
      totalValue: 0,
      byType: {} as Record<AssetDisposalType, { count: number; value: number }>,
      byStatus: {} as Record<AssetDisposalStatus, number>,
    };

    // Initialize Enums
    Object.values(AssetDisposalStatus).forEach((s) => (result.byStatus[s] = 0));
    Object.values(AssetDisposalType).forEach(
      (t) => (result.byType[t] = { count: 0, value: 0 }),
    );

    for (const d of disposals) {
      const value = Number(d.disposalValue);
      result.totalValue += value;
      result.byStatus[d.status as AssetDisposalStatus]++;
      result.byType[d.disposalType as AssetDisposalType].count++;
      result.byType[d.disposalType as AssetDisposalType].value += value;
    }

    return result;
  }
}
