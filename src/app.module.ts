import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './shared/presentation/interfaces';
// Identity modules - refactored to src/modules/
import { OrganizationModule } from './modules/organization';
import { DepartmentModule } from './modules/department';
import { RoleModule } from './modules/role';
import { PermissionModule } from './modules/permission';
import { UserModule } from './modules/user';
import { AuthModule } from './modules/auth';
// Other modules
import { AssetCategoryModule } from './modules/asset-category';
import { AssetModule } from './modules/asset/asset.module';
import { AssetTransferModule } from './modules/asset-transfer';
import { AssetDisposalModule } from './modules/asset-disposal';
import { MaintenanceScheduleModule } from './modules/maintenance-schedule';
import { AssetDocumentModule } from './modules/asset-document';
import { AssetDepreciationModule } from './modules/asset-depreciation';
import { AccountingEntryModule } from './modules/accounting-entry';
import { BudgetPlanModule } from './modules/budget-plan';
import { InventoryCheckModule } from './modules/inventory-check';
import { AuditLogModule } from './modules/audit-log';
import { FileModule } from './modules/file/file.module';
import { SharedInfrastructureModule } from './shared/infrastructure/shared-infrastructure.module';
import { TenantContextInterceptor } from './shared/infrastructure/context/tenant-context.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Identity
    AuthModule,
    OrganizationModule,
    DepartmentModule,
    RoleModule,
    PermissionModule,
    UserModule,
    // Asset Management
    AssetCategoryModule,
    AssetModule,
    AssetTransferModule,
    AssetDisposalModule,
    MaintenanceScheduleModule,
    AssetDocumentModule,
    AssetDepreciationModule,
    AccountingEntryModule,
    BudgetPlanModule,
    InventoryCheckModule,
    AuditLogModule,
    FileModule,
    SharedInfrastructureModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantContextInterceptor,
    },
  ],
})
export class AppModule { }
