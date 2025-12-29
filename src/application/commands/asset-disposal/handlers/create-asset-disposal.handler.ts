import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import { ID_GENERATOR, type IIdGenerator } from 'src/domain/core/interfaces';
import {
    ASSET_DISPOSAL_REPOSITORY,
    type IAssetDisposalRepository,
    AssetDisposal,
} from 'src/domain/asset-lifecycle/asset-disposal';
import {
    ASSET_REPOSITORY,
    type IAssetRepository,
} from 'src/modules/asset/domain';
import { CreateAssetDisposalCommand } from '../create-asset-disposal.command';

@Injectable()
export class CreateAssetDisposalHandler {
    constructor(
        @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
        @Inject(ASSET_DISPOSAL_REPOSITORY)
        private readonly disposalRepo: IAssetDisposalRepository,
        @Inject(ASSET_REPOSITORY)
        private readonly assetRepo: IAssetRepository,
    ) { }

    async execute(cmd: CreateAssetDisposalCommand): Promise<AssetDisposal> {
        const asset = await this.assetRepo.findById(cmd.assetId);
        if (!asset) {
            throw new UseCaseException(
                `Asset with id ${cmd.assetId} not found`,
                CreateAssetDisposalCommand.name,
            );
        }

        // Check if asset already has a pending or approved disposal
        const hasPending = await this.disposalRepo.hasPendingDisposal(cmd.assetId);
        if (hasPending) {
            throw new UseCaseException(
                `Asset ${cmd.assetId} already has a pending disposal`,
                CreateAssetDisposalCommand.name
            );
        }

        const hasApproved = await this.disposalRepo.hasApprovedDisposal(cmd.assetId);
        if (hasApproved) {
            throw new UseCaseException(
                `Asset ${cmd.assetId} already has an approved disposal`,
                CreateAssetDisposalCommand.name
            );
        }

        const id = this.idGenerator.generate();
        const disposal = AssetDisposal.builder(
            id,
            cmd.assetId,
            cmd.organizationId,
            cmd.disposalType,
        )
            .atDate(cmd.disposalDate)
            .withValue(cmd.disposalValue)
            .withReason(cmd.reason)
            .build();

        return await this.disposalRepo.save(disposal);
    }
}
