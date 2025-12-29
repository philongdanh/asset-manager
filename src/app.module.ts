import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './presentation/interfaces';
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
import { AssetTransferModule } from './presentation/asset-transfer/asset-transfer.module';
import { AssetDisposalModule } from './presentation/asset-disposal/asset-disposal.module';
import { MaintenanceScheduleModule } from './presentation/maintenance-schedule/maintenance-schedule.module';
import { AssetDocumentModule } from './presentation/asset-document/asset-document.module';
import { AssetDepreciationModule } from './presentation/asset-depreciation/asset-depreciation.module';
import { AccountingEntryModule } from './presentation/accounting-entry/accounting-entry.module';
import { BudgetPlanModule } from './presentation/budget-plan/budget-plan.module';
import { InventoryCheckModule } from './presentation/inventory-check/inventory-check.module';
import { AuditLogModule } from './presentation/audit-log/audit-log.module';

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
