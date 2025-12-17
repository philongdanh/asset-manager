/*
  Warnings:

  - A unique constraint covering the columns `[organization_id,code]` on the table `AssetCategories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organization_id,asset_code]` on the table `Assets` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organization_id,name]` on the table `Departments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organization_id,role_name]` on the table `Roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organization_id,username]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Assets_asset_code_key";

-- DropIndex
DROP INDEX "Roles_role_name_key";

-- DropIndex
DROP INDEX "Users_username_key";

-- CreateIndex
CREATE UNIQUE INDEX "AssetCategories_organization_id_code_key" ON "AssetCategories"("organization_id", "code");

-- CreateIndex
CREATE INDEX "Assets_organization_id_idx" ON "Assets"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "Assets_organization_id_asset_code_key" ON "Assets"("organization_id", "asset_code");

-- CreateIndex
CREATE UNIQUE INDEX "Departments_organization_id_name_key" ON "Departments"("organization_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Roles_organization_id_role_name_key" ON "Roles"("organization_id", "role_name");

-- CreateIndex
CREATE UNIQUE INDEX "Users_organization_id_username_key" ON "Users"("organization_id", "username");
