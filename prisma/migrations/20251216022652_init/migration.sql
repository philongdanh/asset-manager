-- CreateTable
CREATE TABLE "Organizations" (
    "organization_id" TEXT NOT NULL,
    "org_name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Organizations_pkey" PRIMARY KEY ("organization_id")
);

-- CreateTable
CREATE TABLE "Departments" (
    "department_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parent_department_id" TEXT,

    CONSTRAINT "Departments_pkey" PRIMARY KEY ("department_id")
);

-- CreateTable
CREATE TABLE "Users" (
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "department_id" TEXT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "AssetCategories" (
    "category_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "category_name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "parent_category_id" TEXT,

    CONSTRAINT "AssetCategories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "Assets" (
    "asset_id" TEXT NOT NULL,
    "asset_code" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "created_by_user_id" TEXT NOT NULL,
    "current_department_id" TEXT,
    "current_user_id" TEXT,
    "asset_name" TEXT NOT NULL,
    "model" TEXT,
    "serial_number" TEXT,
    "manufacturer" TEXT,
    "purchase_date" DATE,
    "purchase_price" DECIMAL(15,2) NOT NULL,
    "original_cost" DECIMAL(15,2) NOT NULL,
    "current_value" DECIMAL(15,2) NOT NULL,
    "status" TEXT NOT NULL,
    "warranty_expiry_date" DATE,
    "location" TEXT,
    "specifications" TEXT,
    "condition" TEXT,

    CONSTRAINT "Assets_pkey" PRIMARY KEY ("asset_id")
);

-- CreateTable
CREATE TABLE "AssetDepreciation" (
    "depreciation_id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "depreciation_date" DATE NOT NULL,
    "method" TEXT NOT NULL,
    "depreciation_value" DECIMAL(15,2) NOT NULL,
    "accumulated_depreciation" DECIMAL(15,2) NOT NULL,
    "remaining_value" DECIMAL(15,2) NOT NULL,
    "accounting_entry_id" TEXT,

    CONSTRAINT "AssetDepreciation_pkey" PRIMARY KEY ("depreciation_id")
);

-- CreateTable
CREATE TABLE "MaintenanceSchedules" (
    "schedule_id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "maintenance_type" TEXT NOT NULL,
    "scheduled_date" DATE NOT NULL,
    "actual_date" DATE,
    "status" TEXT NOT NULL,
    "description" TEXT,
    "estimated_cost" DECIMAL(15,2),
    "actual_cost" DECIMAL(15,2),
    "performed_by_user_id" TEXT,
    "result" TEXT,

    CONSTRAINT "MaintenanceSchedules_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateTable
CREATE TABLE "AssetTransfers" (
    "transfer_id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "transfer_date" DATE NOT NULL,
    "from_department_id" TEXT,
    "to_department_id" TEXT,
    "from_user_id" TEXT,
    "to_user_id" TEXT,
    "approved_by_user_id" TEXT,
    "transfer_type" TEXT NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL,

    CONSTRAINT "AssetTransfers_pkey" PRIMARY KEY ("transfer_id")
);

-- CreateTable
CREATE TABLE "AssetDisposals" (
    "disposal_id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "disposal_date" DATE NOT NULL,
    "disposal_type" TEXT NOT NULL,
    "disposal_value" DECIMAL(15,2) NOT NULL,
    "reason" TEXT,
    "approved_by_user_id" TEXT,
    "status" TEXT NOT NULL,
    "accounting_entry_id" TEXT,

    CONSTRAINT "AssetDisposals_pkey" PRIMARY KEY ("disposal_id")
);

-- CreateTable
CREATE TABLE "AssetDocuments" (
    "document_id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "document_type" TEXT NOT NULL,
    "document_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "upload_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by_user_id" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "AssetDocuments_pkey" PRIMARY KEY ("document_id")
);

-- CreateTable
CREATE TABLE "InventoryChecks" (
    "inventory_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "inventory_date" DATE NOT NULL,
    "inventory_name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_by_user_id" TEXT NOT NULL,

    CONSTRAINT "InventoryChecks_pkey" PRIMARY KEY ("inventory_id")
);

-- CreateTable
CREATE TABLE "InventoryDetails" (
    "inventory_detail_id" TEXT NOT NULL,
    "inventory_id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "checked_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checked_by_user_id" TEXT NOT NULL,
    "physical_status" TEXT NOT NULL,
    "is_matched" BOOLEAN NOT NULL,
    "notes" TEXT,

    CONSTRAINT "InventoryDetails_pkey" PRIMARY KEY ("inventory_detail_id")
);

-- CreateTable
CREATE TABLE "AuditLogs" (
    "log_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "old_value" TEXT,
    "new_value" TEXT,
    "action_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,

    CONSTRAINT "AuditLogs_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "AccountingEntries" (
    "entry_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "entry_type" TEXT NOT NULL,
    "entry_date" DATE NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "description" TEXT,
    "asset_id" TEXT,
    "reference_id" TEXT,
    "reference_type" TEXT,
    "created_by_user_id" TEXT NOT NULL,

    CONSTRAINT "AccountingEntries_pkey" PRIMARY KEY ("entry_id")
);

-- CreateTable
CREATE TABLE "BudgetPlans" (
    "budget_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "fiscal_year" INTEGER NOT NULL,
    "budget_type" TEXT NOT NULL,
    "allocated_amount" DECIMAL(15,2) NOT NULL,
    "spent_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,

    CONSTRAINT "BudgetPlans_pkey" PRIMARY KEY ("budget_id")
);

-- CreateTable
CREATE TABLE "Roles" (
    "role_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "permission_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "UserRoles" (
    "user_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,

    CONSTRAINT "UserRoles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "RolePermissions" (
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,

    CONSTRAINT "RolePermissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Assets_asset_code_key" ON "Assets"("asset_code");

-- CreateIndex
CREATE UNIQUE INDEX "Roles_role_name_key" ON "Roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "Permissions_name_key" ON "Permissions"("name");

-- AddForeignKey
ALTER TABLE "Departments" ADD CONSTRAINT "Departments_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departments" ADD CONSTRAINT "Departments_parent_department_id_fkey" FOREIGN KEY ("parent_department_id") REFERENCES "Departments"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Departments"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetCategories" ADD CONSTRAINT "AssetCategories_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetCategories" ADD CONSTRAINT "AssetCategories_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "AssetCategories"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assets" ADD CONSTRAINT "Assets_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assets" ADD CONSTRAINT "Assets_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "AssetCategories"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assets" ADD CONSTRAINT "Assets_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assets" ADD CONSTRAINT "Assets_current_department_id_fkey" FOREIGN KEY ("current_department_id") REFERENCES "Departments"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assets" ADD CONSTRAINT "Assets_current_user_id_fkey" FOREIGN KEY ("current_user_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetDepreciation" ADD CONSTRAINT "AssetDepreciation_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Assets"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetDepreciation" ADD CONSTRAINT "AssetDepreciation_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceSchedules" ADD CONSTRAINT "MaintenanceSchedules_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Assets"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceSchedules" ADD CONSTRAINT "MaintenanceSchedules_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceSchedules" ADD CONSTRAINT "MaintenanceSchedules_performed_by_user_id_fkey" FOREIGN KEY ("performed_by_user_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetTransfers" ADD CONSTRAINT "AssetTransfers_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Assets"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetTransfers" ADD CONSTRAINT "AssetTransfers_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetTransfers" ADD CONSTRAINT "AssetTransfers_from_department_id_fkey" FOREIGN KEY ("from_department_id") REFERENCES "Departments"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetTransfers" ADD CONSTRAINT "AssetTransfers_to_department_id_fkey" FOREIGN KEY ("to_department_id") REFERENCES "Departments"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetTransfers" ADD CONSTRAINT "AssetTransfers_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetTransfers" ADD CONSTRAINT "AssetTransfers_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetTransfers" ADD CONSTRAINT "AssetTransfers_approved_by_user_id_fkey" FOREIGN KEY ("approved_by_user_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetDisposals" ADD CONSTRAINT "AssetDisposals_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Assets"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetDisposals" ADD CONSTRAINT "AssetDisposals_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetDisposals" ADD CONSTRAINT "AssetDisposals_approved_by_user_id_fkey" FOREIGN KEY ("approved_by_user_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetDocuments" ADD CONSTRAINT "AssetDocuments_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Assets"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetDocuments" ADD CONSTRAINT "AssetDocuments_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetDocuments" ADD CONSTRAINT "AssetDocuments_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryChecks" ADD CONSTRAINT "InventoryChecks_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryChecks" ADD CONSTRAINT "InventoryChecks_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryDetails" ADD CONSTRAINT "InventoryDetails_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "InventoryChecks"("inventory_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryDetails" ADD CONSTRAINT "InventoryDetails_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Assets"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryDetails" ADD CONSTRAINT "InventoryDetails_checked_by_user_id_fkey" FOREIGN KEY ("checked_by_user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLogs" ADD CONSTRAINT "AuditLogs_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLogs" ADD CONSTRAINT "AuditLogs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountingEntries" ADD CONSTRAINT "AccountingEntries_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountingEntries" ADD CONSTRAINT "AccountingEntries_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Assets"("asset_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountingEntries" ADD CONSTRAINT "AccountingEntries_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetPlans" ADD CONSTRAINT "BudgetPlans_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetPlans" ADD CONSTRAINT "BudgetPlans_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Departments"("department_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roles" ADD CONSTRAINT "Roles_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissions" ADD CONSTRAINT "RolePermissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissions" ADD CONSTRAINT "RolePermissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permissions"("permission_id") ON DELETE RESTRICT ON UPDATE CASCADE;
