import { Module } from '@nestjs/common';
import {
    CreateAssetDisposalHandler,
    ApproveAssetDisposalHandler,
    RejectAssetDisposalHandler,
    CancelAssetDisposalHandler,
} from 'src/application/commands/asset-disposal/handlers';
import {
    GetAssetDisposalsHandler,
    GetAssetDisposalDetailsHandler,
} from 'src/application/queries/handlers';
import { ASSET_REPOSITORY } from 'src/domain/asset-lifecycle/asset';
import { ASSET_DISPOSAL_REPOSITORY } from 'src/domain/asset-lifecycle/asset-disposal';
import { ID_GENERATOR } from 'src/domain/core/interfaces';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import {
    PrismaAssetRepository,
    PrismaAssetDisposalRepository,
} from 'src/infrastructure/persistence/prisma/repositories';
import { AssetDisposalController } from './asset-disposal.controller';

@Module({
    controllers: [AssetDisposalController],
    providers: [
        PrismaService,
        {
            provide: ID_GENERATOR,
            useClass: UuidGeneratorService,
        },
        {
            provide: ASSET_DISPOSAL_REPOSITORY,
            useClass: PrismaAssetDisposalRepository,
        },
        {
            provide: ASSET_REPOSITORY,
            useClass: PrismaAssetRepository,
        },
        CreateAssetDisposalHandler,
        ApproveAssetDisposalHandler,
        RejectAssetDisposalHandler,
        CancelAssetDisposalHandler,
        GetAssetDisposalsHandler,
        GetAssetDisposalDetailsHandler,
    ],
})
export class AssetDisposalModule { }
