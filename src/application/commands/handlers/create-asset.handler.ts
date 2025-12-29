import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import { ID_GENERATOR, type IIdGenerator } from 'src/domain/core/interfaces';
import {
    ASSET_REPOSITORY,
    type IAssetRepository,
    Asset,
    AssetCondition,
    AssetStatus,
} from 'src/domain/asset-lifecycle/asset';
import { CreateAssetCommand } from '../create-asset.command';

@Injectable()
export class CreateAssetHandler {
    constructor(
        @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
        @Inject(ASSET_REPOSITORY)
        private readonly assetRepo: IAssetRepository,
    ) { }

    async execute(cmd: CreateAssetCommand): Promise<Asset> {
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
            .build();

        return await this.assetRepo.save(asset);
    }
}
