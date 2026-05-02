/*
  Warnings:

  - A unique constraint covering the columns `[modelId,slug]` on the table `car_versions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'HIDDEN', 'DELETED');

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "commentsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "ratingsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "ReviewStatus" NOT NULL DEFAULT 'PUBLISHED',
ADD COLUMN     "votesCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "car_versions_modelId_slug_key" ON "car_versions"("modelId", "slug");

-- CreateIndex
CREATE INDEX "reviews_status_createdAt_idx" ON "reviews"("status", "createdAt");

-- CreateIndex
CREATE INDEX "reviews_carVersionYearId_status_score_idx" ON "reviews"("carVersionYearId", "status", "score");

-- CreateIndex
CREATE INDEX "reviews_carVersionYearId_status_createdAt_idx" ON "reviews"("carVersionYearId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "reviews_userId_createdAt_idx" ON "reviews"("userId", "createdAt");
