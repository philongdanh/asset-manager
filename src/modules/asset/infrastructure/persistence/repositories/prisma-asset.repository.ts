import { Injectable } from '@nestjs/common';
import { IAssetRepository } from '../../../domain/repositories/asset.repository.interface';
import {
  Asset,
  AssetStatus,
  AssetCondition,
} from '../../../domain/entities/asset.entity';
import { AssetMapper } from '../../mappers/asset.mapper';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class PrismaAssetRepository implements IAssetRepository {
  constructor(private prisma: PrismaService) {}

  async findByStatus(
    organizationId: string,
    status: AssetStatus,
  ): Promise<Asset[]> {
    const raws = await this.prisma.asset.findMany({
      where: {
        organizationId,
        status,
        deletedAt: null,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return raws.map((raw) => AssetMapper.toDomain(raw));
  }

  async getAssetsSummary(organizationId: string): Promise<{
    totalCount: number;
    totalValue: number;
    byStatus: Record<AssetStatus, { count: number; value: number }>;
    byCategory: Record<string, { count: number; value: number }>;
    byDepartment: Record<string, { count: number; value: number }>;
  }> {
    const assets = await this.prisma.asset.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      select: {
        status: true,
        categoryId: true,
        currentDepartmentId: true,
        currentValue: true,
      },
    });

    // Khởi tạo kết quả
    const result = {
      totalCount: assets.length,
      totalValue: 0,
      byStatus: {} as Record<AssetStatus, { count: number; value: number }>,
      byCategory: {} as Record<string, { count: number; value: number }>,
      byDepartment: {} as Record<string, { count: number; value: number }>,
    };

    // Khởi tạo các trạng thái
    Object.values(AssetStatus).forEach((status) => {
      result.byStatus[status] = { count: 0, value: 0 };
    });

    // Tính toán thống kê
    assets.forEach((asset) => {
      const value = asset.currentValue.toNumber();
      result.totalValue += value;

      // Thống kê theo trạng thái
      result.byStatus[asset.status as AssetStatus].count += 1;
      result.byStatus[asset.status as AssetStatus].value += value;

      // Thống kê theo danh mục
      if (asset.categoryId) {
        if (!result.byCategory[asset.categoryId]) {
          result.byCategory[asset.categoryId] = { count: 0, value: 0 };
        }
        result.byCategory[asset.categoryId].count += 1;
        result.byCategory[asset.categoryId].value += value;
      }

      // Thống kê theo phòng ban
      if (asset.currentDepartmentId) {
        if (!result.byDepartment[asset.currentDepartmentId]) {
          result.byDepartment[asset.currentDepartmentId] = {
            count: 0,
            value: 0,
          };
        }
        result.byDepartment[asset.currentDepartmentId].count += 1;
        result.byDepartment[asset.currentDepartmentId].value += value;
      }
    });

    return result;
  }

  async findAssetsWithWarrantyExpiring(
    organizationId: string,
    daysThreshold: number,
  ): Promise<Asset[]> {
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + daysThreshold);

    const raws = await this.prisma.asset.findMany({
      where: {
        organizationId,
        deletedAt: null,
        warrantyExpiryDate: {
          not: null,
          gte: today,
          lte: thresholdDate,
        },
      },
      orderBy: {
        warrantyExpiryDate: 'asc',
      },
    });

    return raws.map((raw) => AssetMapper.toDomain(raw));
  }

  async findAssetsForMaintenance(organizationId: string): Promise<Asset[]> {
    const raws = await this.prisma.asset.findMany({
      where: {
        organizationId,
        deletedAt: null,
        OR: [
          { status: AssetStatus.MAINTENANCE },
          { condition: AssetCondition.POOR },
          { condition: AssetCondition.BROKEN },
        ],
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return raws.map((raw) => AssetMapper.toDomain(raw));
  }

  async findById(assetId: string): Promise<Asset | null> {
    const raw = await this.prisma.asset.findFirst({
      where: {
        id: assetId,
      },
    });
    console.log('raw', raw);
    return raw ? AssetMapper.toDomain(raw) : null;
  }

  async findByCode(
    organizationId: string,
    assetCode: string,
  ): Promise<Asset | null> {
    const raw = await this.prisma.asset.findFirst({
      where: {
        organizationId,
        assetCode,
        deletedAt: null,
      },
    });
    return raw ? AssetMapper.toDomain(raw) : null;
  }

  async find(
    organizationId: string,
    options?: {
      status?: AssetStatus;
      categoryId?: string;
      departmentId?: string;
      userId?: string;
      limit?: number;
      offset?: number;
      search?: string;
      includeDeleted?: boolean;
    },
  ): Promise<{ data: Asset[]; total: number }> {
    const where: Prisma.AssetWhereInput = {
      organizationId,
      deletedAt: options?.includeDeleted == false ? null : undefined,
      status: options?.status,
      categoryId: options?.categoryId,
      currentDepartmentId: options?.departmentId,
      currentUserId: options?.userId,
    };

    if (options?.search) {
      where.OR = [
        { assetName: { contains: options.search, mode: 'insensitive' } },
        { assetCode: { contains: options.search, mode: 'insensitive' } },
        { model: { contains: options.search, mode: 'insensitive' } },
        { serialNumber: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.asset.findMany({
        where,
        take: options?.limit,
        skip: options?.offset,
        orderBy: {
          updatedAt: 'desc',
        },
      }),
      this.prisma.asset.count({ where }),
    ]);

    return {
      data: data.map((raw) => AssetMapper.toDomain(raw)),
      total,
    };
  }

  async findByDepartment(departmentId: string): Promise<Asset[]> {
    const raws = await this.prisma.asset.findMany({
      where: {
        currentDepartmentId: departmentId,
        deletedAt: null,
      },
    });
    return raws.map((raw) => AssetMapper.toDomain(raw));
  }

  async findByUser(userId: string): Promise<Asset[]> {
    const raws = await this.prisma.asset.findMany({
      where: {
        currentUserId: userId,
        deletedAt: null,
      },
    });
    return raws.map((raw) => AssetMapper.toDomain(raw));
  }

  async findByCategory(categoryId: string): Promise<Asset[]> {
    const raws = await this.prisma.asset.findMany({
      where: {
        categoryId,
        deletedAt: null,
      },
    });
    return raws.map((raw) => AssetMapper.toDomain(raw));
  }

  async findByOrganization(organizationId: string): Promise<Asset[]> {
    const raws = await this.prisma.asset.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
    });
    return raws.map((raw) => AssetMapper.toDomain(raw));
  }

  async existsByCode(
    organizationId: string,
    assetCode: string,
  ): Promise<boolean> {
    const count = await this.prisma.asset.count({
      where: {
        organizationId,
        assetCode,
        deletedAt: null,
      },
    });
    return count > 0;
  }

  async existsById(assetId: string): Promise<boolean> {
    const count = await this.prisma.asset.count({
      where: {
        id: assetId,
        deletedAt: null,
      },
    });
    return count > 0;
  }

  async save(asset: Asset): Promise<Asset> {
    const { data } = AssetMapper.toPersistence(asset);
    const raw = await this.prisma.asset.create({
      data,
    });
    return AssetMapper.toDomain(raw);
  }

  async update(asset: Asset): Promise<Asset> {
    const { data } = AssetMapper.toPersistence(asset);
    const raw = await this.prisma.asset.update({
      where: { id: asset.id },
      data,
    });
    return AssetMapper.toDomain(raw);
  }

  async saveMany(assets: Asset[]): Promise<void> {
    const createData = assets.map(
      (asset) => AssetMapper.toPersistence(asset).data,
    );

    await this.prisma.$transaction(
      createData.map((data) => this.prisma.asset.create({ data })),
    );
  }

  async delete(assetId: string): Promise<void> {
    await this.prisma.asset.update({
      where: { id: assetId },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
        status: AssetStatus.DISPOSED,
      },
    });
  }

  async deleteMany(assetIds: string[]): Promise<void> {
    await this.prisma.asset.updateMany({
      where: { id: { in: assetIds } },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
        status: AssetStatus.DISPOSED,
      },
    });
  }

  async hardDelete(assetId: string): Promise<void> {
    await this.prisma.asset.delete({
      where: { id: assetId },
    });
  }

  async hardDeleteMany(assetIds: string[]): Promise<void> {
    await this.prisma.asset.deleteMany({
      where: { id: { in: assetIds } },
    });
  }

  async restore(assetId: string): Promise<void> {
    await this.prisma.asset.update({
      where: { id: assetId },
      data: {
        deletedAt: null,
        updatedAt: new Date(),
        status: AssetStatus.AVAILABLE,
      },
    });
  }

  async restoreMany(assetIds: string[]): Promise<void> {
    await this.prisma.asset.updateMany({
      where: { id: { in: assetIds } },
      data: {
        deletedAt: null,
        updatedAt: new Date(),
        status: AssetStatus.AVAILABLE,
      },
    });
  }

  async findDeletedById(assetId: string): Promise<Asset | null> {
    const raw = await this.prisma.asset.findFirst({
      where: {
        id: assetId,
        deletedAt: { not: null },
      },
    });
    return raw ? AssetMapper.toDomain(raw) : null;
  }
}
