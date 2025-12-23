import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssetModule } from './presentation/asset/asset.module';
import { ConfigModule } from '@nestjs/config';
import { OrganizationModule } from './presentation/interfaces/organization/organization.module';
import { AssetCategoryModule } from './presentation/asset-category/asset-category.module';
import { PermissionModule } from './presentation/interfaces/permission/permission.module';
import { RoleModule } from './presentation/interfaces/role/role.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './presentation/interfaces/exceptions/filters/global-exception.filter';
import { DepartmentModule } from './presentation/interfaces/department/department.module';

@Module({
  imports: [
    //
    ConfigModule.forRoot(),
    OrganizationModule,
    DepartmentModule,
    AssetCategoryModule,
    AssetModule,
    PermissionModule,
    RoleModule,
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
export class AppModule {}
