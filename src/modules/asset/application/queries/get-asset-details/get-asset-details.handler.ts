import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  ASSET_REPOSITORY,
  type IAssetRepository,
} from '../../../domain/repositories/asset.repository.interface';
import { Asset } from '../../../domain/entities/asset.entity';
import { GetAssetDetailsQuery } from './get-asset-details.query';

@Injectable()
export class GetAssetDetailsHandler {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepo: IAssetRepository,
  ) {}

  async execute(query: GetAssetDetailsQuery): Promise<Asset> {
    const asset = await this.assetRepo.findById(query.assetId);
    if (!asset) {
      throw new UseCaseException(
        `Asset with id ${query.assetId} not found`,
        GetAssetDetailsQuery.name,
      );
    }
    return asset;
  }
}
