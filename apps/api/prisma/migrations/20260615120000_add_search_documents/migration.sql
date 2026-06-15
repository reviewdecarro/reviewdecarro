CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE OR REPLACE FUNCTION immutable_unaccent(value text)
RETURNS text
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
STRICT
AS $$
  SELECT public.unaccent('public.unaccent', value)
$$;

CREATE TYPE "SearchEntityType" AS ENUM ('REVIEW', 'TOPIC');

CREATE TABLE "search_documents" (
  "id" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "entityType" "SearchEntityType" NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "excerpt" TEXT,
  "authorName" TEXT,
  "brandName" TEXT,
  "modelName" TEXT,
  "versionName" TEXT,
  "year" INTEGER,
  "slug" TEXT NOT NULL,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "votesCount" INTEGER NOT NULL DEFAULT 0,
  "commentsCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "searchVector" tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('portuguese', immutable_unaccent(coalesce("title", ''))), 'A') ||
    setweight(to_tsvector('portuguese', immutable_unaccent(coalesce("brandName", ''))), 'A') ||
    setweight(to_tsvector('portuguese', immutable_unaccent(coalesce("modelName", ''))), 'A') ||
    setweight(to_tsvector('portuguese', immutable_unaccent(coalesce("versionName", ''))), 'B') ||
    setweight(to_tsvector('portuguese', coalesce("year"::text, '')), 'B') ||
    setweight(to_tsvector('portuguese', immutable_unaccent(coalesce("content", ''))), 'C')
  ) STORED,
  CONSTRAINT "search_documents_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "search_documents_entityId_entityType_key"
ON "search_documents"("entityId", "entityType");
CREATE INDEX "search_documents_entityType_idx" ON "search_documents"("entityType");
CREATE INDEX "search_documents_brandName_idx" ON "search_documents"("brandName");
CREATE INDEX "search_documents_modelName_idx" ON "search_documents"("modelName");
CREATE INDEX "search_documents_year_idx" ON "search_documents"("year");
CREATE INDEX "search_documents_score_idx" ON "search_documents"("score");
CREATE INDEX "search_documents_createdAt_idx" ON "search_documents"("createdAt");
CREATE INDEX "search_documents_searchVector_idx"
ON "search_documents" USING GIN ("searchVector");
CREATE INDEX "search_documents_searchText_trgm_idx"
ON "search_documents" USING GIN ((immutable_unaccent(lower(
  coalesce("title", '') || ' ' ||
  coalesce("brandName", '') || ' ' ||
  coalesce("modelName", '') || ' ' ||
  coalesce("versionName", '') || ' ' ||
  coalesce("year"::text, '')
))) gin_trgm_ops);
