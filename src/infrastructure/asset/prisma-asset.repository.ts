// src/infrastructure/asset/prisma-asset.repository.ts
// Lớp ngoài cùng phụ thuộc vào Prisma

import { Injectable } from '@nestjs/common';
import { IAssetRepository } from '../../domain/asset/asset.repository.interface';
import { Asset } from '../../domain/asset/asset.entity';
import { AssetMapper } from './asset.mapper'; // Mapper để chuyển đổi
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaAssetRepository implements IAssetRepository {
  constructor(private prisma: PrismaService) {}

  async findByOrgAndCode(
    organizationId: number,
    assetCode: string,
  ): Promise<Asset | null> {
    const prismaAsset = await this.prisma.asset.findUnique({
      where: {
        organization_id_asset_code: {
          organization_id: organizationId,
          asset_code: assetCode,
        },
      },
    });

    return prismaAsset ? AssetMapper.toDomain(prismaAsset) : null;
  }

  async save(asset: Asset): Promise<Asset> {
    const data = AssetMapper.toPersistence(asset);

    // Sử dụng Prisma Client đã được tạo ra
    const prismaAsset = await this.prisma.asset.create({ data });

    return AssetMapper.toDomain(prismaAsset);
  }
}
