# Structure

## Monorepo Layout

```
reviewdecarro/
├── apps/
│   ├── api/                     # NestJS REST API (port 3000)
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── generated/       # Prisma client + model types
│   │   ├── src/
│   │   │   ├── main.ts          # Bootstrap, global pipes/interceptors/swagger
│   │   │   ├── app.module.ts    # Root module (ConfigModule + HttpModule)
│   │   │   ├── application/          # Business logic per application
│   │   │   ├── infra/           # Adapters (http, auth, database)
│   │   │   └── shared/          # Cross-cutting (decorators, errors)
│   │   └── test/                # E2E tests
│   └── web/                     # Next.js frontend (port 3001) — scaffolding only
├── packages/
│   ├── api/                     # Shared NestJS types (@repo/api)
│   ├── ui/                      # Shared React components (@repo/ui)
│   ├── jest-config/             # Shared Jest configs (@repo/jest-config)
│   ├── typescript-config/       # Shared tsconfig bases
│   └── eslint-config/           # Shared ESLint config
├── docker-compose.yml           # PostgreSQL 16
└── turbo.json                   # Build pipeline
```

## API Source Tree (apps/api/src)

```
src/
├── application/
│   ├── users/                   # ✅ Implemented
│   │   ├── dtos/                # CreateUserDto, LoginUserDto, UserResponseDto
│   │   ├── entities/            # UserEntity
│   │   ├── mappers/             # toUserResponseDto()
│   │   ├── repositories/        # UsersRepositoryProps (abstract)
│   │   └── use-cases/           # CreateUser, AuthenticateUser, FindUserByUsername
│   ├── cars/                    # 🔲 Empty — schema exists
│   ├── reviews/                 # 🔲 Empty — schema exists
│   ├── comments/                # 🔲 Empty — schema exists
│   └── votes/                   # 🔲 Empty — schema exists
├── infra/
│   ├── auth/
│   │   ├── auth.module.ts       # JWT module config
│   │   ├── auth.service.ts      # Token generation + user validation
│   │   ├── constants/           # JWT secret + expiration
│   │   ├── guards/              # JwtAuthGuard (global, supports @IsPublic)
│   │   ├── strategies/          # JwtStrategy (Passport)
│   │   └── types/               # JwtPayload type
│   ├── database/
│   │   ├── database.module.ts   # PrismaService + repository bindings
│   │   └── prisma/
│   │       ├── prisma.service.ts
│   │       └── repositories/    # PrismaUsersRepository
│   └── http/
│       ├── http.module.ts       # All controllers + use-case providers
│       └── controllers/
│           └── users/           # UsersController + response.props.ts
└── shared/
    ├── decorators/              # @IsPublic(), @LoggedInUser()
    └── errors/
        ├── types/               # BadRequestError
        └── interceptors/        # BadRequestInterceptor (global)
```

## Prisma Models

- **User** (users) — id, username, email, passwordHash, active, createdAt → roles, reviews, comments, votes
- **Role** (roles) — id, type (ADMIN|USER), userId → unique(userId, type)
- **Brand** (brands) — id, name, slug → models
- **Model** (models) — id, name, slug, brandId → unique(brandId, slug), carVersions
- **CarVersion** (car_versions) — id, modelId, year, versionName, engine, transmission, slug → reviews
- **Review** (reviews) — id, userId, carVersionId, title, content, pros, cons, ownershipTimeMonths, kmDriven, score → ratings, comments, votes
- **ReviewRating** (review_ratings) — id, reviewId, category (8 types), value → unique(reviewId, category)
- **Comment** (comments) — id, reviewId, userId, content, createdAt
- **ReviewVote** (review_votes) — id, userId, reviewId, type (UP|DOWN) → unique(userId, reviewId)
