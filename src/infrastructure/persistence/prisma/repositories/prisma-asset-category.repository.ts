import { Injectable } from '@nestjs/common';
import {
  IAssetCategoryRepository,
  AssetCategory,
} from 'src/domain/asset-lifecycle/asset-category';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AssetCategoryMapper } from '../../../mappers/asset-category.mapper';
import { Prisma } from 'generated/prisma/browser';

@Injectable()
export class PrismaAssetCategoryRepository implements IAssetCategoryRepository {
  constructor(private prisma: PrismaService) {}

  async findById(categoryId: string): Promise<AssetCategory | null> {
    const category = await this.prisma.assetCategory.findFirst({
      where: {
        id: categoryId,
        deletedAt: null,
      },
    });
    return category ? AssetCategoryMapper.toDomain(category) : null;
  }

  async findByCode(
    organizationId: string,
    code: string,
  ): Promise<AssetCategory | null> {
    const category = await this.prisma.assetCategory.findFirst({
      where: {
        organizationId,
        code,
        deletedAt: null,
      },
    });
    return category ? AssetCategoryMapper.toDomain(category) : null;
  }

  async findAll(
    organizationId: string,
    options?: {
      limit?: number;
      offset?: number;
      includeDeleted?: boolean;
    },
  ): Promise<{ data: AssetCategory[]; total: number }> {
    const where: Prisma.AssetCategoryWhereInput = {
      organizationId,
    };

    if (!options?.includeDeleted) {
      where.deletedAt = null;
    }

    const [data, total] = await Promise.all([
      this.prisma.assetCategory.findMany({
        where,
        take: options?.limit,
        skip: options?.offset,
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.assetCategory.count({ where }),
    ]);

    return {
      data: data.map((category) => AssetCategoryMapper.toDomain(category)),
      total,
    };
  }

  async findChildren(parentId: string): Promise<AssetCategory[]> {
    const categories = await this.prisma.assetCategory.findMany({
      where: {
        parentId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'asc' },
    });
    return categories.map((category) => AssetCategoryMapper.toDomain(category));
  }

  async findRootCategories(organizationId: string): Promise<AssetCategory[]> {
    const categories = await this.prisma.assetCategory.findMany({
      where: {
        organizationId,
        parentId: null,
        deletedAt: null,
      },
      orderBy: { createdAt: 'asc' },
    });
    return categories.map((category) => AssetCategoryMapper.toDomain(category));
  }

  async findByOrganization(organizationId: string): Promise<AssetCategory[]> {
    const categories = await this.prisma.assetCategory.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'asc' },
    });
    return categories.map((category) => AssetCategoryMapper.toDomain(category));
  }

  async existsByCode(organizationId: string, code: string): Promise<boolean> {
    const count = await this.prisma.assetCategory.count({
      where: {
        organizationId,
        code,
        deletedAt: null,
      },
    });
    return count > 0;
  }

  async existsById(categoryId: string): Promise<boolean> {
    const count = await this.prisma.assetCategory.count({
      where: {
        id: categoryId,
        deletedAt: null,
      },
    });
    return count > 0;
  }

  async hasDependencies(categoryId: string): Promise<boolean> {
    // Kiểm tra xem có asset nào thuộc category này không
    const assetCount = await this.prisma.asset.count({
      where: {
        categoryId,
        deletedAt: null,
      },
    });

    // Kiểm tra xem có category con nào không (chỉ cần 1)
    const childrenCount = await this.prisma.assetCategory.count({
      where: {
        parentId: categoryId,
        deletedAt: null,
      },
      take: 1,
    });

    return assetCount > 0 || childrenCount > 0;
  }

  async save(category: AssetCategory): Promise<AssetCategory> {
    const upsertArgs = AssetCategoryMapper.toUpsertArgs(category);
    const savedCategory = await this.prisma.assetCategory.upsert(upsertArgs);
    return AssetCategoryMapper.toDomain(savedCategory);
  }

  async update(category: AssetCategory): Promise<AssetCategory> {
    const updateInput = AssetCategoryMapper.toUpdateInput(category);
    const updatedCategory = await this.prisma.assetCategory.update({
      where: { id: category.id },
      data: updateInput,
    });
    return AssetCategoryMapper.toDomain(updatedCategory);
  }

  async saveMany(categories: AssetCategory[]): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      for (const category of categories) {
        const upsertArgs = AssetCategoryMapper.toUpsertArgs(category);
        await tx.assetCategory.upsert(upsertArgs);
      }
    });
  }

  async delete(categoryId: string): Promise<void> {
    await this.prisma.assetCategory.update({
      where: { id: categoryId },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async deleteMany(categoryIds: string[]): Promise<void> {
    await this.prisma.assetCategory.updateMany({
      where: { id: { in: categoryIds } },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async hardDelete(categoryId: string): Promise<void> {
    await this.prisma.assetCategory.delete({
      where: { id: categoryId },
    });
  }

  async hardDeleteMany(categoryIds: string[]): Promise<void> {
    await this.prisma.assetCategory.deleteMany({
      where: { id: { in: categoryIds } },
    });
  }

  async restore(categoryId: string): Promise<void> {
    await this.prisma.assetCategory.update({
      where: { id: categoryId },
      data: {
        deletedAt: null,
        updatedAt: new Date(),
      },
    });
  }

  async restoreMany(categoryIds: string[]): Promise<void> {
    await this.prisma.assetCategory.updateMany({
      where: { id: { in: categoryIds } },
      data: {
        deletedAt: null,
        updatedAt: new Date(),
      },
    });
  }

  // Các phương thức cũ (giữ lại để tương thích)
  async find(): Promise<AssetCategory[]> {
    const categories = await this.prisma.assetCategory.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
    return categories.map((category) => AssetCategoryMapper.toDomain(category));
  }

  async findByOrganizationAndCode(
    organizationId: string,
    code: string,
  ): Promise<AssetCategory | null> {
    const category = await this.prisma.assetCategory.findFirst({
      where: {
        organizationId,
        code,
        deletedAt: null,
      },
    });
    return category ? AssetCategoryMapper.toDomain(category) : null;
  }
}
