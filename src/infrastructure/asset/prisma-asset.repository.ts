import { Injectable } from '@nestjs/common';
import { IAssetRepository } from 'src/domain/modules/asset/asset.repository.interface';
import { Asset } from 'src/domain/modules/asset/asset.entity';
import { AssetMapper } from './asset.mapper';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaAssetRepository implements IAssetRepository {
  constructor(private prisma: PrismaService) {}

  async findByOrganizationAndCode(
    orgId: string,
    assetCode: string,
  ): Promise<Asset | null> {
    const prismaAsset = await this.prisma.asset.findFirst({
      where: {
        organizationId: orgId,
        assetCode: assetCode,
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
