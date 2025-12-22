import { Prisma, Asset as PrismaAsset } from 'generated/prisma/client';
import { Asset } from 'src/domain/modules/asset';

export class AssetMapper {
  static toDomain(prismaAsset: PrismaAsset): Asset {
    return new Asset(
      prismaAsset.id,
      prismaAsset.organizationId,
      prismaAsset.assetName,
      prismaAsset.assetCode,
    );
  }

  static toPersistence(asset: Asset): Prisma.AssetCreateInput {
    return {
      organization: {
        connect: { id: asset.organizationId },
      },
      assetName: asset.name,
      assetCode: asset.code,
      purchasePrice: '',
      originalCost: '',
      currentValue: '',
      status: '',
      category: {
        create: undefined,
        connectOrCreate: undefined,
        connect: undefined,
      },
      creator: {
        create: undefined,
        connectOrCreate: undefined,
        connect: undefined,
      },
    };
  }
}
