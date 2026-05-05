# Design: Run database seed in CI

**Date:** 2026-05-04

## Problem

The CI pipeline runs migrations but does not seed the database. E2e tests that depend on reference data (brands, models, car versions) have no data to work with.

## Solution

Add a "Seed database" step in `.github/workflows/ci.yml` after "Run migrations" and before "Lint".

## Change

**File:** `.github/workflows/ci.yml`

Insert after the "Run migrations" step:

```yaml
- name: Seed database
  run: pnpm seed
  working-directory: apps/api
```

`pnpm seed` runs `ts-node prisma/seed.ts`, which reads `DATABASE_URL` from the environment — already set in the workflow.

## Step Order

```
Generate Prisma client → Run migrations → Seed database → Lint → Build → Test
```

## No other changes needed

The seed script, the env var, and the Postgres service are already configured correctly. This is a one-step addition only.
