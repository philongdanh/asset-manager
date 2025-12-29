import { Module } from '@nestjs/common';
import {
    ApproveAssetTransferHandler,
    CancelAssetTransferHandler,
    CompleteAssetTransferHandler,
    CreateAssetTransferHandler,
    RejectAssetTransferHandler,
} from 'src/application/commands/handlers';
import {
    GetAssetTransferDetailsHandler,
    GetAssetTransfersHandler,
} from 'src/application/queries/handlers';
import { ASSET_REPOSITORY } from 'src/modules/asset/domain';
import { ASSET_TRANSFER_REPOSITORY } from 'src/domain/asset-lifecycle/asset-transfer';
import { ID_GENERATOR } from 'src/domain/core/interfaces';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import {
    PrismaAssetRepository,
    PrismaAssetTransferRepository,
} from 'src/infrastructure/persistence/prisma/repositories';
import { AssetTransferController } from './asset-transfer.controller';

@Module({
    controllers: [AssetTransferController],
    providers: [
        PrismaService,
        {
            provide: ID_GENERATOR,
            useClass: UuidGeneratorService,
        },
        {
            provide: ASSET_TRANSFER_REPOSITORY,
            useClass: PrismaAssetTransferRepository,
        },
        {
            provide: ASSET_REPOSITORY,
            useClass: PrismaAssetRepository,
        },
        CreateAssetTransferHandler,
        ApproveAssetTransferHandler,
        RejectAssetTransferHandler,
        CompleteAssetTransferHandler,
        CancelAssetTransferHandler,
        GetAssetTransfersHandler,
        GetAssetTransferDetailsHandler,
    ],
})
export class AssetTransferModule { }
