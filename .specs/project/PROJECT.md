# ReviewDeCarro

## Vision

A platform for Brazilian car owners to share honest reviews, ratings, and discussions about vehicles — helping buyers make informed decisions based on real ownership experiences.

## Goals

1. **Car review platform** — Users write detailed reviews of specific car versions with structured ratings across 8 categories (consumption, maintenance, reliability, comfort, performance, technology, finish, resale value)
2. **Community engagement** — Comments on reviews and up/down voting to surface the most helpful content
3. **Car catalog** — Organized hierarchy: Brand → Model → CarVersion (year + trim)
4. **User system** — Registration, authentication, role-based access (admin/user)

## Current State

The project is in **early development**. The foundation is solid:
- Monorepo structure with Turborepo
- NestJS API with Clean Architecture
- Full Prisma schema covering all 5 applications (9 models)
- JWT authentication working
- Users application fully implemented (register, login, find by username)
- 4 remaining applications (cars, reviews, comments, votes) have schema but no application code

The web frontend (Next.js) is scaffolding only — no pages or components built yet.

## Non-Goals (for now)

- Mobile app
- Social login (Google, GitHub)
- Image uploads for reviews
- Admin dashboard
- Search/filtering (will come after CRUD is complete)
