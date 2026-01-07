import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';
import {
  ASSET_REPOSITORY,
  type IAssetRepository,
} from '../../../domain/repositories/asset.repository.interface';
import {
  Asset,
  AssetCondition,
  AssetStatus,
} from '../../../domain/entities/asset.entity';
import { CreateAssetCommand } from './create-asset.command';
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
export class CreateAssetHandler {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepo: IAssetRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepo: IOrganizationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(ASSET_CATEGORY_REPOSITORY)
    private readonly categoryRepo: IAssetCategoryRepository,
  ) {}

  async execute(cmd: CreateAssetCommand): Promise<AssetResult> {
    const existsByCode = await this.assetRepo.existsByCode(
      cmd.organizationId,
      cmd.assetCode,
    );
    if (existsByCode) {
      throw new UseCaseException(
        `Asset definition with code ${cmd.assetCode} already exists`,
        CreateAssetCommand.name,
      );
    }

    const id = this.idGenerator.generate();
    const asset = Asset.builder(
      id,
      cmd.organizationId,
      cmd.assetCode,
      cmd.assetName,
    )
      .withCategory(cmd.categoryId)
      .createdBy(cmd.createdByUserId)
      .withPrice(cmd.purchasePrice)
      .withOriginalCost(cmd.originalCost)
      .withCurrentValue(cmd.currentValue)
      .withModel(cmd.model)
      .withSerialNumber(cmd.serialNumber)
      .withManufacturer(cmd.manufacturer)
      .withPurchaseDate(cmd.purchaseDate)
      .withWarrantyExpiryDate(cmd.warrantyExpiryDate)
      .withLocation(cmd.location)
      .withSpecifications(cmd.specifications)
      .withCondition(
        cmd.condition ? (cmd.condition as AssetCondition) : AssetCondition.NEW,
      )
      .withStatus(
        cmd.status ? (cmd.status as AssetStatus) : AssetStatus.AVAILABLE,
      )
      .withImageUrl(cmd.imageUrl)
      .build();

    const savedAsset = await this.assetRepo.save(asset);

    const [organization, category, createdByUser] = await Promise.all([
      this.orgRepo.findById(savedAsset.organizationId),
      this.categoryRepo.findById(savedAsset.categoryId),
      this.userRepo.findById(savedAsset.createdByUserId),
    ]);

    return {
      asset: savedAsset,
      organization,
      category,
      createdByUser,
    };
  }
}
