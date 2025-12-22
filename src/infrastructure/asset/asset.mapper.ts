import { Prisma, Asset as PrismaAsset } from 'generated/prisma/client';
import { Asset } from 'src/domain/modules/asset';

export class AssetMapper {
  static toDomain(prismaAsset: PrismaAsset): Asset {
    return new Asset(
      prismaAsset.id,
      prismaAsset.organizationId,
      prismaAsset.currentDepartmentId,
      prismaAsset.assetName,
      prismaAsset.assetCode,
    );
  }

  static toPersistence(asset: Asset): Prisma.AssetCreateArgs {
    return {
      data: {
        purchasePrice: 0,
        purchaseDate: '',
        organizationId: asset.organizationId,
        currentDepartmentId: asset.departmentId,
        assetName: asset.name,
        assetCode: asset.code,
      },
    };
  }
}
