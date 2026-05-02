/*
  Warnings:

  - You are about to drop the column `year` on the `car_versions` table. All the data in the column will be lost.
  - You are about to drop the column `carVersionId` on the `reviews` table. All the data in the column will be lost.
  - Added the required column `carVersionYearId` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_carVersionId_fkey";

-- DropIndex
DROP INDEX "car_versions_slug_key";

-- DropIndex
DROP INDEX "reviews_carVersionId_idx";

-- AlterTable
ALTER TABLE "car_versions" DROP COLUMN "year";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "carVersionId",
ADD COLUMN     "carVersionYearId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "car_version_years" (
    "id" TEXT NOT NULL,
    "carVersionId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_version_years_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "car_version_years_year_idx" ON "car_version_years"("year");

-- CreateIndex
CREATE INDEX "car_version_years_carVersionId_idx" ON "car_version_years"("carVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "car_version_years_carVersionId_year_key" ON "car_version_years"("carVersionId", "year");

-- CreateIndex
CREATE INDEX "reviews_carVersionYearId_idx" ON "reviews"("carVersionYearId");

-- AddForeignKey
ALTER TABLE "car_version_years" ADD CONSTRAINT "car_version_years_carVersionId_fkey" FOREIGN KEY ("carVersionId") REFERENCES "car_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_carVersionYearId_fkey" FOREIGN KEY ("carVersionYearId") REFERENCES "car_version_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
