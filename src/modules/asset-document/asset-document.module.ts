import { Module, Provider } from '@nestjs/common';
import { ASSET_DOCUMENT_REPOSITORY } from './domain';
import { PrismaAssetDocumentRepository } from './infrastructure';
import {
  UploadAssetDocumentHandler,
  DeleteAssetDocumentHandler,
  GetAssetDocumentsHandler,
  GetAssetDocumentDetailsHandler,
} from './application';
import { AssetDocumentController } from './presentation';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { UuidGeneratorService } from 'src/shared/infrastructure/id-generator';
import { ASSET_REPOSITORY } from '../asset/domain';
import { PrismaAssetRepository } from '../asset/infrastructure/persistence/repositories/prisma-asset.repository';

const handlers: Provider[] = [
  UploadAssetDocumentHandler,
  DeleteAssetDocumentHandler,
  GetAssetDocumentsHandler,
  GetAssetDocumentDetailsHandler,
];

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
    ...handlers,
  ],
  exports: [ASSET_DOCUMENT_REPOSITORY],
})
export class AssetDocumentModule {}
