import { Injectable } from '@nestjs/common';
import { IAssetRepository } from 'src/domain/asset-lifecycle/asset/asset.repository.interface';
import { Asset } from 'src/domain/asset-lifecycle/asset/asset.entity';
import { AssetMapper } from '../../../mappers/asset.mapper';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class PrismaAssetRepository implements IAssetRepository {
  constructor(private prisma: PrismaService) {}

  async findById(assetId: string): Promise<Asset | null> {
    const raw = await this.prisma.asset.findUnique({
      where: {
        id: assetId,
        deletedAt: null,
      },
    });
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

  async findAll(
    organizationId: string,
    options?: {
      status?: string;
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
    };

    if (!options?.includeDeleted) {
      where.deletedAt = null;
    }

    if (options?.status) where.status = options.status;
    if (options?.categoryId) where.categoryId = options.categoryId;
    if (options?.departmentId) where.currentDepartmentId = options.departmentId;
    if (options?.userId) where.currentUserId = options.userId;

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
        status: 'DISPOSED',
      },
    });
  }

  async deleteMany(assetIds: string[]): Promise<void> {
    await this.prisma.asset.updateMany({
      where: { id: { in: assetIds } },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
        status: 'DISPOSED',
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
        status: 'AVAILABLE',
      },
    });
  }

  async restoreMany(assetIds: string[]): Promise<void> {
    await this.prisma.asset.updateMany({
      where: { id: { in: assetIds } },
      data: {
        deletedAt: null,
        updatedAt: new Date(),
        status: 'AVAILABLE',
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
