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
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { UuidGeneratorService } from 'src/shared/infrastructure/id-generator';
import { ASSET_REPOSITORY } from '../asset/domain';
import { PrismaAssetRepository } from '../asset/infrastructure/persistence/repositories/prisma-asset.repository';
import { ORGANIZATION_REPOSITORY } from '../organization/domain';
import { PrismaOrganizationRepository } from '../organization/infrastructure/persistence/repositories/prisma-organization.repository';
import { USER_REPOSITORY } from '../user/domain';
import { PrismaUserRepository } from '../user/infrastructure/persistence/repositories/prisma-user.repository';

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
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: PrismaOrganizationRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    ...handlers,
  ],
  exports: [ASSET_DISPOSAL_REPOSITORY],
})
export class AssetDisposalModule { }
