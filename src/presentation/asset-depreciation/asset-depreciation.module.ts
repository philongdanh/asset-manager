import { Module } from '@nestjs/common';
import { RecordDepreciationHandler } from 'src/application/commands/asset-depreciation/handlers';
import {
    GetAssetDepreciationsHandler,
    GetAssetDepreciationDetailsHandler,
} from 'src/application/queries/handlers';
import { ASSET_REPOSITORY } from 'src/modules/asset/domain';
import { ASSET_DEPRECIATION_REPOSITORY } from 'src/domain/finance-accounting/asset-depreciation';
import { ID_GENERATOR } from 'src/domain/core/interfaces';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import {
    PrismaAssetRepository,
    PrismaAssetDepreciationRepository,
} from 'src/infrastructure/persistence/prisma/repositories';
import { AssetDepreciationController } from './asset-depreciation.controller';

@Module({
    controllers: [AssetDepreciationController],
    providers: [
        PrismaService,
        {
            provide: ID_GENERATOR,
            useClass: UuidGeneratorService,
        },
        {
            provide: ASSET_DEPRECIATION_REPOSITORY,
            useClass: PrismaAssetDepreciationRepository,
        },
        {
            provide: ASSET_REPOSITORY,
            useClass: PrismaAssetRepository,
        },
        RecordDepreciationHandler,
        GetAssetDepreciationsHandler,
        GetAssetDepreciationDetailsHandler,
    ],
})
export class AssetDepreciationModule { }
