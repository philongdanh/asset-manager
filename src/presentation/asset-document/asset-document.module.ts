import { Module } from '@nestjs/common';
import {
    UploadAssetDocumentHandler,
    DeleteAssetDocumentHandler,
} from 'src/application/commands/asset-document/handlers';
import {
    GetAssetDocumentsHandler,
    GetAssetDocumentDetailsHandler,
} from 'src/application/queries/handlers';
import { ASSET_REPOSITORY } from 'src/modules/asset/domain';
import { ASSET_DOCUMENT_REPOSITORY } from 'src/domain/asset-lifecycle/asset-document';
import { ID_GENERATOR } from 'src/domain/core/interfaces';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import {
    PrismaAssetRepository,
    PrismaAssetDocumentRepository,
} from 'src/infrastructure/persistence/prisma/repositories';
import { AssetDocumentController } from './asset-document.controller';

@Module({
    controllers: [AssetDocumentController],
    providers: [
        PrismaService,
        {
            provide: ID_GENERATOR,
            useClass: UuidGeneratorService,
        },
        {
            provide: ASSET_DOCUMENT_REPOSITORY,
            useClass: PrismaAssetDocumentRepository,
        },
        {
            provide: ASSET_REPOSITORY,
            useClass: PrismaAssetRepository,
        },
        UploadAssetDocumentHandler,
        DeleteAssetDocumentHandler,
        GetAssetDocumentsHandler,
        GetAssetDocumentDetailsHandler,
    ],
})
export class AssetDocumentModule { }
