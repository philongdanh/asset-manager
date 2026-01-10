import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';
import {
  ASSET_DEPRECIATION_REPOSITORY,
  type IAssetDepreciationRepository,
  AssetDepreciation,
} from 'src/modules/asset-depreciation/domain';
import {
  ASSET_REPOSITORY,
  type IAssetRepository,
} from 'src/modules/asset/domain';
import { RecordDepreciationCommand } from './record-depreciation.command';

@Injectable()
export class RecordDepreciationHandler {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(ASSET_DEPRECIATION_REPOSITORY)
    private readonly depreciationRepo: IAssetDepreciationRepository,
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepo: IAssetRepository,
  ) {}

  async execute(cmd: RecordDepreciationCommand): Promise<AssetDepreciation> {
    const asset = await this.assetRepo.findById(cmd.assetId);
    if (!asset) {
      throw new UseCaseException(
        `Asset with id ${cmd.assetId} not found`,
        RecordDepreciationCommand.name,
      );
    }

    const newRemainingValue = asset.currentValue - cmd.depreciationValue;
    const newAccumulatedDepreciation = asset.originalCost - newRemainingValue;

    if (newRemainingValue < 0) {
      throw new UseCaseException(
        'Depreciation value exceeds current asset value',
        RecordDepreciationCommand.name,
      );
    }

    const id = this.idGenerator.generate();
    const depreciation = AssetDepreciation.builder(
      id,
      cmd.assetId,
      cmd.organizationId,
      cmd.method,
    )
      .atDate(cmd.depreciationDate)
      .withValues(
        cmd.depreciationValue,
        newAccumulatedDepreciation,
        newRemainingValue,
      )
      .build();

    await this.depreciationRepo.save(depreciation);

    asset.updateFinancials(
      asset.purchasePrice,
      asset.originalCost,
      newRemainingValue,
      asset.purchaseDate,
      asset.warrantyExpiryDate,
    );
    await this.assetRepo.update(asset);

    return depreciation;
  }
}
