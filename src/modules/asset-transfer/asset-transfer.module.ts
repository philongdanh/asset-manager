import { Module, Provider } from '@nestjs/common';
import { ASSET_TRANSFER_REPOSITORY } from './domain';
import { PrismaAssetTransferRepository } from './infrastructure';
import {
  ApproveAssetTransferHandler,
  CancelAssetTransferHandler,
  CompleteAssetTransferHandler,
  CreateAssetTransferHandler,
  RejectAssetTransferHandler,
  GetAssetTransferDetailsHandler,
  GetAssetTransfersHandler,
} from './application';
import { AssetTransferController } from './presentation';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { UuidGeneratorService } from 'src/shared/infrastructure/id-generator';
import { ASSET_REPOSITORY } from '../asset/domain';
import { PrismaAssetRepository } from '../asset/infrastructure/persistence/repositories/prisma-asset.repository';
import { ORGANIZATION_REPOSITORY, PrismaOrganizationRepository } from '../organization';
import { DEPARTMENT_REPOSITORY, PrismaDepartmentRepository } from '../department';
import { PrismaUserRepository, USER_REPOSITORY } from '../user';

const handlers: Provider[] = [
  CreateAssetTransferHandler,
  ApproveAssetTransferHandler,
  RejectAssetTransferHandler,
  CompleteAssetTransferHandler,
  CancelAssetTransferHandler,
  GetAssetTransfersHandler,
  GetAssetTransferDetailsHandler,
];

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
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: PrismaOrganizationRepository,
    },
    {
      provide: DEPARTMENT_REPOSITORY,
      useClass: PrismaDepartmentRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    ...handlers,
  ],
  exports: [ASSET_TRANSFER_REPOSITORY],
})
export class AssetTransferModule { }
