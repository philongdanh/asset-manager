import {
  Prisma,
  AssetCategory as PrismaAssetCategory,
} from 'generated/prisma/client';
import { AssetCategory } from 'src/domain/asset-lifecycle/asset-category';

export class AssetCategoryMapper {
  static toDomain(prismaCategory: PrismaAssetCategory): AssetCategory {
    return AssetCategory.builder(
      prismaCategory.id,
      prismaCategory.organizationId,
      prismaCategory.code,
      prismaCategory.categoryName,
    )
      .withParent(prismaCategory.parentId)
      .withTimestamps(
        prismaCategory.createdAt,
        prismaCategory.updatedAt,
        prismaCategory.deletedAt,
      )
      .build();
  }

  static toCreateInput(
    assetCategory: AssetCategory,
  ): Prisma.AssetCategoryCreateInput {
    return {
      id: assetCategory.id,
      organization: {
        connect: {
          id: assetCategory.id,
        },
      },
      categoryName: assetCategory.categoryName,
      code: assetCategory.code,
      parent: assetCategory.parentId
        ? {
            connect: { id: assetCategory.parentId },
          }
        : undefined,
      createdAt: assetCategory.createdAt,
      updatedAt: assetCategory.updatedAt,
      deletedAt: assetCategory.deletedAt,
    };
  }

  static toUpdateInput(
    assetCategory: AssetCategory,
  ): Prisma.AssetCategoryUpdateInput {
    return {
      categoryName: assetCategory.categoryName,
      code: assetCategory.code,
      parent: assetCategory.parentId
        ? {
            connect: { id: assetCategory.parentId },
          }
        : { disconnect: true },
      updatedAt: assetCategory.updatedAt,
      deletedAt: assetCategory.deletedAt,
    };
  }

  static toUpsertArgs(
    assetCategory: AssetCategory,
  ): Prisma.AssetCategoryUpsertArgs {
    return {
      where: { id: assetCategory.id },
      create: this.toCreateInput(assetCategory),
      update: this.toUpdateInput(assetCategory),
    };
  }
}
