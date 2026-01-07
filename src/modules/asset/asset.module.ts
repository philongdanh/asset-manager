import { Module } from '@nestjs/common';
import { CreateAssetHandler } from './application/commands/create-asset/create-asset.handler';
import { DeleteAssetHandler } from './application/commands/delete-asset/delete-asset.handler';
import { UpdateAssetHandler } from './application/commands/update-asset/update-asset.handler';
import { GetAssetDetailsHandler } from './application/queries/get-asset-details/get-asset-details.handler';
import { GetAssetsHandler } from './application/queries/get-assets/get-assets.handler';
import { ASSET_REPOSITORY } from './domain/repositories/asset.repository.interface';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { UuidGeneratorService } from 'src/shared/infrastructure/id-generator';
import { PrismaService } from 'src/shared/infrastructure/prisma';
import { PrismaAssetRepository } from './infrastructure/persistence/repositories/prisma-asset.repository';
import { AssetController } from './presentation';
import { OrganizationModule } from '../organization/organization.module';
import { UserModule } from '../user/user.module';
import { AssetCategoryModule } from '../asset-category/asset-category.module';

@Module({
  imports: [OrganizationModule, UserModule, AssetCategoryModule],
  controllers: [AssetController],
  providers: [
    PrismaService,
    {
      provide: ID_GENERATOR,
      useClass: UuidGeneratorService,
    },
    {
      provide: ASSET_REPOSITORY,
      useClass: PrismaAssetRepository,
    },
    CreateAssetHandler,
    UpdateAssetHandler,
    DeleteAssetHandler,
    GetAssetsHandler,
    GetAssetDetailsHandler,
  ],
})
export class AssetModule { }
