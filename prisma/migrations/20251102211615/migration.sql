/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `UserRole` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `UserRole` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `name` on the `UserRole` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "public"."Department_name_key";

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserRole" ADD COLUMN     "description" TEXT,
ADD COLUMN     "key" TEXT NOT NULL,
DROP COLUMN "name",
ADD COLUMN     "name" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."UserRoleNames";

-- CreateIndex
CREATE UNIQUE INDEX "Department_key_key" ON "Department"("key");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_key_key" ON "UserRole"("key");
