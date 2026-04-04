-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "type" "RoleType" NOT NULL DEFAULT 'USER',
    "userId" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "roles_userId_idx" ON "roles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_userId_type_key" ON "roles"("userId", "type");

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
