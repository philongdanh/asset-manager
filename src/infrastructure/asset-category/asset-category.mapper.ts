import { Prisma } from 'generated/prisma/client';
import { AssetCategory } from 'src/domain/modules/asset-category';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const assetCategoryInclude = {
  children: true,
} as const satisfies Prisma.AssetCategoryInclude;

type AssetCategoryWithChildren = Prisma.AssetCategoryGetPayload<{
  include: typeof assetCategoryInclude;
}>;

export class AssetCategoryMapper {
  static toDomain(
    prismaAssetCategory: AssetCategoryWithChildren,
  ): AssetCategory {
    const domain = new AssetCategory(
      prismaAssetCategory.id,
      prismaAssetCategory.organizationId,
      prismaAssetCategory.categoryName,
      prismaAssetCategory.code,
      prismaAssetCategory.parentId,
    );

    // Using optional chaining and proper typing avoids the 'any' cast
    prismaAssetCategory.children?.forEach((child) => {
      const domainChild = AssetCategoryMapper.toDomain(
        child as AssetCategoryWithChildren,
      );
      domain.addChild(
        domainChild.id,
        domainChild.organizationId,
        domainChild.name,
        domainChild.code,
        domainChild.parentId,
      );
    });

    return domain;
  }

  static toPersistence(asset: AssetCategory): Prisma.AssetCategoryCreateInput {
    return {
      id: asset.id,
      organization: {
        connect: { id: asset.organizationId },
      },
      categoryName: asset.name,
      code: asset.code,
      // Use conditional connection to avoid errors if parentId is null
      parent: asset.parentId
        ? {
            connect: {
              id: asset.parentId,
            },
          }
        : undefined,
    };
  }
}
