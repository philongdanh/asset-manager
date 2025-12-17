import { Injectable } from '@nestjs/common';
import {
  AssetCategory,
  IAssetCategoryRepository,
} from 'src/domain/asset-category';
import { PrismaService } from '../prisma';
import { AssetCategoryMapper } from './asset-category.mapper';

@Injectable()
export class PrismaAssetCategoryRepository implements IAssetCategoryRepository {
  constructor(private prisma: PrismaService) {}

  async findByOrgAndCode(
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
    });
    return assetCategory ? AssetCategoryMapper.toDomain(assetCategory) : null;
  }

  async save(assetCategory: AssetCategory): Promise<AssetCategory> {
    const persistedAssetCategory = await this.prisma.assetCategory.upsert({
      where: { id: assetCategory.id },
      update: AssetCategoryMapper.toPersistence(assetCategory),
      create: AssetCategoryMapper.toPersistence(assetCategory),
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
