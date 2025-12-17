import {
  Prisma,
  AssetCategory as PrismaAssetCategory,
} from 'generated/prisma/client';
import { AssetCategory } from 'src/domain/asset-category';

export class AssetCategoryMapper {
  static toDomain(prismaAssetCategory: PrismaAssetCategory): AssetCategory {
    return new AssetCategory(
      prismaAssetCategory.id,
      prismaAssetCategory.organizationId,
      prismaAssetCategory.categoryName,
      prismaAssetCategory.code,
      null,
      new Map<string, any>(),
      [],
    );
  }

  static toPersistence(asset: AssetCategory): Prisma.AssetCategoryCreateInput {
    return {
      id: asset.id,
      organization: {
        connect: { id: asset.orgId },
      },
      categoryName: asset.name,
      code: asset.code,
      parent: {
        connect: {
          id: asset.parentCategoryId!,
        },
      },
    };
  }
}
