# Integrations

## External Services

### PostgreSQL (Docker)
- **Image**: postgres:16-alpine
- **Container**: `reviewdecarro_db`
- **Port**: 5432
- **Credentials**: user=reviewdecarro_db, password=johnny123, db=reviewdecarro
- **Start**: `docker compose up -d` from repo root

### Swagger / OpenAPI
- **Endpoint**: `/api/docs`
- **Config**: Set up in `main.ts` with Bearer auth support
- **Title**: "ReviewDeCarro API"

## Internal Integrations

### Prisma → PostgreSQL
- Uses `@prisma/adapter-pg` (driver adapter pattern, not default Prisma engine)
- Generated to `prisma/generated/` with CJS module format
- Schema search path controlled via `?schema=public` query param in DATABASE_URL

### JWT Authentication
- **Secret**: `process.env.JWT_SECRET` (default: "default-secret-change-me")
- **Expiration**: 1 day
- **Payload**: `{ sub: user_id, email: string }`

### Turborepo Pipeline
- `dev` — no cache, persistent
- `build` — depends on `^build`, outputs `.next/**`, `dist/**`
- `lint`, `test`, `test:e2e` — no special config

## Not Yet Integrated
- No email service (registration message mentions email confirmation but it's not implemented)
- No file upload / image storage
- No rate limiting
- No CI/CD pipeline
- No logging/observability service
- No caching layer (Redis, etc.)
