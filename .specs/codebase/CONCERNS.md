# Concerns

## Technical Debt

### 1. `@repo/api` package contains unrelated scaffolding
The shared `packages/api` package exports Link entity/DTOs (from Turborepo template), which have no relation to the ReviewDeCarro domain. Should be cleaned up or repurposed for shared API types.

### 2. Single HttpModule for all domains
`http.module.ts` registers all controllers and use-case providers in one module. As domains grow (cars, reviews, comments, votes), this will become unwieldy. Consider per-domain NestJS modules.

### 3. No controller tests
Controllers have zero test coverage. Business logic is tested via use-case specs, but HTTP-layer behavior (status codes, response shapes, guard interactions) is untested.

### 4. No E2E tests
The E2E test directory and config exist but no actual tests. Critical flows (register → login → create review) have no integration verification.

### 5. Hardcoded JWT default secret
`jwt.constants.ts` has a fallback `"default-secret-change-me"` — safe for dev but risky if `.env` is misconfigured in production.

### 6. Only BadRequestError exists
The error system only has `BadRequestError`. As domains grow, `NotFoundError`, `UnauthorizedError`, `ConflictError` etc. will be needed, each with a corresponding interceptor or a unified error interceptor.

## Architectural Risks

### 7. No role-based authorization in controllers
The `Role` model exists in Prisma with ADMIN/USER types, but no role-checking guard or decorator is implemented. Auth only verifies identity, not permissions.

### 8. Registration claims email confirmation but doesn't send it
The controller response says "Um e-mail de confirmação foi enviado" but no email service exists.

### 9. DatabaseModule binds only UsersRepository
As new domains are built, each abstract repository needs to be added to `DatabaseModule`. Easy to forget.

## Low Priority

### 10. Dual linter setup
Both ESLint and Biome are installed. Unclear which is primary — could cause conflicting rules.

### 11. `@repo/api` not used by the API app
The shared types package exists but the API doesn't import from it — types live directly in the domain layer.
