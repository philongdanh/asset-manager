// src/infrastructure/asset/asset.mapper.ts
import { Prisma, Asset as PrismaAsset } from 'generated/prisma/client'; // Import type từ Prisma
import { Asset } from '../../domain/asset/asset.entity';

// Chuyển đổi từ Domain Entity sang Prisma/DB Object
export class AssetMapper {
  static toDomain(prismaAsset: PrismaAsset): Asset {
    // ... logic chuyển đổi từ DB sang Domain
    return new Asset(
      prismaAsset.asset_id,
      prismaAsset.organization_id,
      prismaAsset.asset_name || '',
      prismaAsset.asset_code || '',
      // ...
    );
  }

  static toPersistence(asset: Asset): Prisma.AssetCreateInput {
    // ... logic chuyển đổi từ Domain sang DB
    return {
      //   organization_id: asset.organization_id,
      organization: {
        connect: { organization_id: asset.organization_id },
      },
      asset_name: asset.asset_name,
      asset_code: asset.asset_code,
      // ...
    };
  }
}
