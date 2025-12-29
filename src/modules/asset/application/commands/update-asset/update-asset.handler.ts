import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  ASSET_REPOSITORY,
  type IAssetRepository,
} from '../../../domain/repositories/asset.repository.interface';
import {
  Asset,
  AssetCondition,
  AssetStatus,
} from '../../../domain/entities/asset.entity';
import { UpdateAssetCommand } from './update-asset.command';

@Injectable()
export class UpdateAssetHandler {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepo: IAssetRepository,
  ) {}

  async execute(cmd: UpdateAssetCommand): Promise<Asset> {
    const asset = await this.assetRepo.findById(cmd.assetId);
    if (!asset) {
      throw new UseCaseException(
        `Asset with id ${cmd.assetId} not found`,
        UpdateAssetCommand.name,
      );
    }

    asset.updateBasicInfo(cmd.assetName, cmd.categoryId);
    asset.updateTechnicalDetails(cmd.model, cmd.serialNumber, cmd.manufacturer);
    asset.updateFinancials(
      cmd.purchasePrice,
      cmd.originalCost,
      cmd.currentValue,
      cmd.purchaseDate,
      cmd.warrantyExpiryDate,
    );
    asset.updatePhysicalCondition(
      cmd.condition as AssetCondition,
      cmd.location,
      cmd.specifications,
    );
    asset.changeStatus(cmd.status as AssetStatus);

    return await this.assetRepo.update(asset);
  }
}
