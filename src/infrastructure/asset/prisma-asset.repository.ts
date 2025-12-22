import { Injectable } from '@nestjs/common';
import { IAssetRepository } from 'src/domain/asset-lifecycle/asset/asset.repository.interface';
import { Asset } from 'src/domain/asset-lifecycle/asset/asset.entity';
import { AssetMapper } from './asset.mapper';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaAssetRepository implements IAssetRepository {
  constructor(private prisma: PrismaService) {}

  async findByOrganization(organizationId: string): Promise<Asset[]> {
    const assets = await this.prisma.asset.findMany({
      where: { organizationId },
    });
    return assets.map((asset) => AssetMapper.toDomain(asset));
  }

  async findByDepartment(departmentId: string): Promise<Asset[]> {
    const assets = await this.prisma.asset.findMany({
      where: { currentDepartmentId: departmentId },
    });
    return assets.map((asset) => AssetMapper.toDomain(asset));
  }

  async findByDepartmentAndCode(
    departmentId: string,
    code: string,
  ): Promise<Asset | null> {
    const asset = await this.prisma.asset.findFirst({
      where: {
        currentDepartmentId: departmentId,
        assetCode: code,
      },
    });
    return asset ? AssetMapper.toDomain(asset) : null;
  }

  async findById(assetId: string): Promise<Asset | null> {
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
    });
    return asset ? AssetMapper.toDomain(asset) : null;
  }

  async findByOrganizationAndCode(
    organizationId: string,
    code: string,
  ): Promise<Asset | null> {
    const asset = await this.prisma.asset.findFirst({
      where: {
        organizationId: organizationId,
        assetCode: code,
      },
    });
    return asset ? AssetMapper.toDomain(asset) : null;
  }

  async save(asset: Asset): Promise<Asset> {
    const data = AssetMapper.toPersistence(asset);
    const savedAsset = await this.prisma.asset.create({ data });
    return AssetMapper.toDomain(savedAsset);
  }
}
