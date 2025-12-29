import { Module, Provider } from '@nestjs/common';
import { ASSET_DISPOSAL_REPOSITORY } from './domain';
import { PrismaAssetDisposalRepository } from './infrastructure';
import {
    ApproveAssetDisposalHandler,
    CancelAssetDisposalHandler,
    CreateAssetDisposalHandler,
    RejectAssetDisposalHandler,
    GetAssetDisposalDetailsHandler,
    GetAssetDisposalsHandler,
} from './application';
import { AssetDisposalController } from './presentation';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';
import { ID_GENERATOR } from '../../domain/core/interfaces';
import { UuidGeneratorService } from '../../infrastructure/common/id-generator';
import { ASSET_REPOSITORY } from '../asset/domain';
import { PrismaAssetRepository } from '../asset/infrastructure/persistence/repositories/prisma-asset.repository';

const handlers: Provider[] = [
    CreateAssetDisposalHandler,
    ApproveAssetDisposalHandler,
    RejectAssetDisposalHandler,
    CancelAssetDisposalHandler,
    GetAssetDisposalsHandler,
    GetAssetDisposalDetailsHandler,
];

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
        ...handlers,
    ],
    exports: [ASSET_DISPOSAL_REPOSITORY],
})
export class AssetDisposalModule { }
