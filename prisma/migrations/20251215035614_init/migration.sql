-- CreateTable
CREATE TABLE "organizations" (
    "organization_id" SERIAL NOT NULL,
    "org_name" TEXT NOT NULL,
    "status" TEXT,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("organization_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "display_name" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "role_id" SERIAL NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "permission_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "asset_categories" (
    "category_id" SERIAL NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "category_name" TEXT NOT NULL,
    "depreciation_method" TEXT,
    "default_life_years" INTEGER,

    CONSTRAINT "asset_categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "assets" (
    "asset_id" SERIAL NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "asset_code" TEXT,
    "asset_name" TEXT,
    "category_id" INTEGER,
    "purchase_date" TIMESTAMP(3),
    "original_cost" DOUBLE PRECISION,
    "current_value" DOUBLE PRECISION,
    "asset_status" TEXT,
    "current_location" TEXT,
    "created_by_user_id" INTEGER,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("asset_id")
);

-- CreateTable
CREATE TABLE "asset_depreciation" (
    "depreciation_id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "depreciation_date" TIMESTAMP(3) NOT NULL,
    "depreciation_amount" DOUBLE PRECISION NOT NULL,
    "accumulated_depreciation" DOUBLE PRECISION NOT NULL,
    "remaining_value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "asset_depreciation_pkey" PRIMARY KEY ("depreciation_id")
);

-- CreateTable
CREATE TABLE "asset_transactions" (
    "transaction_id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "transaction_date" TIMESTAMP(3),
    "from_location" TEXT,
    "to_location" TEXT,
    "performed_by_user_id" INTEGER,

    CONSTRAINT "asset_transactions_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_organization_id_role_name_key" ON "roles"("organization_id", "role_name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "asset_categories_organization_id_category_name_key" ON "asset_categories"("organization_id", "category_name");

-- CreateIndex
CREATE UNIQUE INDEX "assets_organization_id_asset_code_key" ON "assets"("organization_id", "asset_code");

-- CreateIndex
CREATE UNIQUE INDEX "asset_depreciation_asset_id_depreciation_date_key" ON "asset_depreciation"("asset_id", "depreciation_date");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_categories" ADD CONSTRAINT "asset_categories_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "asset_categories"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_depreciation" ADD CONSTRAINT "asset_depreciation_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_transactions" ADD CONSTRAINT "asset_transactions_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_transactions" ADD CONSTRAINT "asset_transactions_performed_by_user_id_fkey" FOREIGN KEY ("performed_by_user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
