import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
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
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from '../../../../organization/domain';
import { USER_REPOSITORY, type IUserRepository } from '../../../../user/domain';
import {
  ASSET_CATEGORY_REPOSITORY,
  type IAssetCategoryRepository,
} from '../../../../asset-category/domain';
import { AssetResult } from '../../dtos/asset.result';

@Injectable()
export class UpdateAssetHandler {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepo: IAssetRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepo: IOrganizationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(ASSET_CATEGORY_REPOSITORY)
    private readonly categoryRepo: IAssetCategoryRepository,
  ) {}

  async execute(cmd: UpdateAssetCommand): Promise<AssetResult> {
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
      cmd.imageUrl,
    );
    asset.changeStatus(cmd.status as AssetStatus);

    const updatedAsset = await this.assetRepo.update(asset);

    const [organization, category, createdByUser] = await Promise.all([
      this.orgRepo.findById(updatedAsset.organizationId),
      this.categoryRepo.findById(updatedAsset.categoryId),
      this.userRepo.findById(updatedAsset.createdByUserId),
    ]);

    return {
      asset: updatedAsset,
      organization,
      category,
      createdByUser,
    };
  }
}
