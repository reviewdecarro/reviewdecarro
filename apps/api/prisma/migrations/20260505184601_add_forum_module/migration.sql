-- CreateEnum
CREATE TYPE "ForumTopicStatus" AS ENUM ('PUBLISHED', 'DELETED');

-- CreateEnum
CREATE TYPE "ForumPostStatus" AS ENUM ('PUBLISHED', 'DELETED');

-- CreateEnum
CREATE TYPE "ForumVoteValue" AS ENUM ('UP', 'DOWN');

-- CreateEnum
CREATE TYPE "ForumVoteTargetType" AS ENUM ('TOPIC', 'POST');

-- CreateTable
CREATE TABLE "forum_topics" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "ForumTopicStatus" NOT NULL DEFAULT 'PUBLISHED',
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "postsCount" INTEGER NOT NULL DEFAULT 0,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "forum_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_posts" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "parentPostId" TEXT,
    "content" TEXT NOT NULL,
    "status" "ForumPostStatus" NOT NULL DEFAULT 'PUBLISHED',
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "forum_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_votes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetType" "ForumVoteTargetType" NOT NULL,
    "value" "ForumVoteValue" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forum_votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "forum_topics_slug_key" ON "forum_topics"("slug");

-- CreateIndex
CREATE INDEX "forum_topics_authorId_idx" ON "forum_topics"("authorId");

-- CreateIndex
CREATE INDEX "forum_topics_status_idx" ON "forum_topics"("status");

-- CreateIndex
CREATE INDEX "forum_topics_createdAt_idx" ON "forum_topics"("createdAt");

-- CreateIndex
CREATE INDEX "forum_topics_slug_idx" ON "forum_topics"("slug");

-- CreateIndex
CREATE INDEX "forum_posts_topicId_idx" ON "forum_posts"("topicId");

-- CreateIndex
CREATE INDEX "forum_posts_authorId_idx" ON "forum_posts"("authorId");

-- CreateIndex
CREATE INDEX "forum_posts_parentPostId_idx" ON "forum_posts"("parentPostId");

-- CreateIndex
CREATE INDEX "forum_posts_status_idx" ON "forum_posts"("status");

-- CreateIndex
CREATE INDEX "forum_posts_createdAt_idx" ON "forum_posts"("createdAt");

-- CreateIndex
CREATE INDEX "forum_votes_targetId_targetType_idx" ON "forum_votes"("targetId", "targetType");

-- CreateIndex
CREATE INDEX "forum_votes_userId_idx" ON "forum_votes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "forum_votes_userId_targetId_targetType_key" ON "forum_votes"("userId", "targetId", "targetType");

-- AddForeignKey
ALTER TABLE "forum_topics" ADD CONSTRAINT "forum_topics_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "forum_topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_parentPostId_fkey" FOREIGN KEY ("parentPostId") REFERENCES "forum_posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_votes" ADD CONSTRAINT "forum_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
