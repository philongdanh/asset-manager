import { Injectable } from '@nestjs/common';
import {
  AssetCategory,
  IAssetCategoryRepository,
} from 'src/domain/asset-lifecycle/asset-category';
import { PrismaService } from '../prisma';
import { AssetCategoryMapper } from './asset-category.mapper';

@Injectable()
export class PrismaAssetCategoryRepository implements IAssetCategoryRepository {
  constructor(private prisma: PrismaService) {}

  async findByOrganization(organizationId: string): Promise<AssetCategory[]> {
    const assetCategories = await this.prisma.assetCategory.findMany({
      where: { organizationId },
    });
    return assetCategories.map((assetCategory) =>
      AssetCategoryMapper.toDomain(assetCategory),
    );
  }

  async find(): Promise<AssetCategory[]> {
    const assetCategories = await this.prisma.assetCategory.findMany({
      include: {
        children: true,
      },
    });
    const mappedAssetCategories = assetCategories.map((assetCategory) =>
      AssetCategoryMapper.toDomain(assetCategory),
    );
    return mappedAssetCategories;
  }

  async findByOrganizationAndCode(
    orgId: string,
    code: string,
  ): Promise<AssetCategory | null> {
    const assetCategory = await this.prisma.assetCategory.findUnique({
      where: {
        organizationId_code: {
          organizationId: orgId,
          code: code,
        },
      },
      include: {
        children: true,
      },
    });
    return assetCategory ? AssetCategoryMapper.toDomain(assetCategory) : null;
  }

  async save(assetCategory: AssetCategory): Promise<AssetCategory> {
    const persistedAssetCategory = await this.prisma.assetCategory.upsert({
      where: { id: assetCategory.id },
      update: AssetCategoryMapper.toPersistence(assetCategory).data,
      create: AssetCategoryMapper.toPersistence(assetCategory).data,
      include: {
        children: true,
      },
    });

    if (!persistedAssetCategory) {
      throw new Error('Failed to save asset category.');
    }

    return AssetCategoryMapper.toDomain(persistedAssetCategory);
  }

  async delete(assetCategoryId: string): Promise<void> {
    await this.prisma.assetCategory.delete({
      where: { id: assetCategoryId },
    });
  }
}
