import {
  Prisma,
  AssetCategory as PrismaAssetCategory,
} from 'generated/prisma/client';
import { AssetCategory } from 'src/domain/asset-lifecycle/asset-category';

export class AssetCategoryMapper {
  static toDomain(prismaCategory: PrismaAssetCategory): AssetCategory {
    return new AssetCategory(
      prismaCategory.id,
      prismaCategory.organizationId,
      prismaCategory.categoryName,
      prismaCategory.code,
      prismaCategory.parentId,
    );
  }

  static toPersistence(
    assetCategory: AssetCategory,
  ): Prisma.AssetCategoryCreateArgs {
    return {
      data: {
        id: assetCategory.id,
        organizationId: assetCategory.organizationId,
        categoryName: assetCategory.name,
        code: assetCategory.code,
        parentId: assetCategory.parentId,
      },
    };
  }
}
