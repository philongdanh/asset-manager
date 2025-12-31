-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_organization_id_fkey";

-- AlterTable
ALTER TABLE "Assets" ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "Organizations" ADD COLUMN     "logo_url" TEXT;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "hashed_refresh_token" TEXT,
ALTER COLUMN "organization_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organizations"("organization_id") ON DELETE SET NULL ON UPDATE CASCADE;
