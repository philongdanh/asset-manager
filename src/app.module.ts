import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { OrganizationModule } from './presentation/organization/organization.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './presentation/interfaces';
import { AuthModule } from './presentation/auth';
import { UserModule } from './presentation/user';
import { AssetCategoryModule } from './presentation/asset-category/asset-category.module';
import { AssetModule } from './presentation/asset/asset.module';
import { AssetTransferModule } from './presentation/asset-transfer/asset-transfer.module';
import { AssetDisposalModule } from './presentation/asset-disposal/asset-disposal.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    OrganizationModule,
    UserModule,
    AssetCategoryModule,
    AssetModule,
    AssetTransferModule,
    AssetDisposalModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule { }
