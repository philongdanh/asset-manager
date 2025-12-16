// src/infrastructure/asset/prisma-asset.repository.ts
// Lớp ngoài cùng phụ thuộc vào Prisma

import { Injectable } from '@nestjs/common';
import { IAssetRepository } from 'src/domain/asset/asset.repository.interface';
import { Asset } from 'src/domain/asset/asset.entity';
import { AssetMapper } from './asset.mapper'; // Mapper để chuyển đổi
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaAssetRepository implements IAssetRepository {
  constructor(private prisma: PrismaService) {}

  async findByOrgAndCode(
    orgId: string,
    assetCode: string,
  ): Promise<Asset | null> {
    const prismaAsset = await this.prisma.asset.findFirst({
      where: {
        OR: [{ organization: { id: orgId } }, { assetCode }],
      },
    });

    return prismaAsset ? AssetMapper.toDomain(prismaAsset) : null;
  }

  async save(asset: Asset): Promise<Asset> {
    const data = AssetMapper.toPersistence(asset);

    const prismaAsset = await this.prisma.asset.create({ data });

    return AssetMapper.toDomain(prismaAsset);
  }
}
