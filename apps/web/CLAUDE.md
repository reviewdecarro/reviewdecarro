# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Warning: Next.js version

This app runs **Next.js 16** (currently `16.2.4`). APIs, conventions, and file structure may differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Commands

Run from `apps/web` or the repo root with `--filter=web`:

```bash
pnpm dev          # dev server on port 3001 (uses --webpack, not Turbopack)
pnpm build        # production build
pnpm lint         # ESLint
```

No test suite exists in this app.

## Environment

- `NEXT_PUBLIC_API_URL` — API base URL, defaults to `http://localhost:3333`
- The API runs on port 3333 (not 3000, despite what the README says)

## Architecture

### Page pattern (server + client split)

Every route follows the same structure:

- `page.tsx` — async Server Component: fetches data, renders `<Nav />`, `<main>`, `<Footer />`, passes data as props to a client page component
- `*-page.tsx` or `*-client.tsx` — `"use client"` component that owns interactivity, state, and user events

Interactive leaf components (forms, buttons, vote controls) are also `"use client"` and co-located in `app/<route>/`.

### Data fetching

All live data goes through `lib/`:

- `lib/forum.ts` — fetches forum topics and thread details; maps raw API shapes to `ForumTopicSummary` / `ForumTopicDetail` / `ForumPost`
- `lib/reviews.ts` — fetches reviews and comments; maps to `PublicReview` / `ReviewDetail` / `ReviewComment`
- `lib/api.ts` — exports `API_BASE_URL`
- `lib/auth.ts` — exports the `AuthUser` type
- `lib/data.ts` — **static mock data** (cars, legacy reviews, threads, blog posts); not connected to the API

All `fetch` calls use `cache: "no-store"`. API calls silently return `[]` or `null` on failure.

### Auth

`hooks/use-auth-session.tsx` provides `AuthSessionContext`. On mount, it hits `GET /auth/me` (with `credentials: "include"`) to hydrate the session. `AuthSessionProvider` wraps the entire app in `layout.tsx`. Use `useAuthSession()` to access `{ authUser, isLoggedIn, isCheckingSession, storeAuthUser, removeAuthUser }` in any client component.

### Types

All shared types live in `types/index.ts`. The API layer defines its own internal `ApiXxx` types locally in each `lib/` file and maps them to the public types before returning.

### Styling

- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- Theming via CSS custom properties — `var(--bg)`, `var(--text)`, `var(--text-muted)`, `var(--surface)`, `var(--border)` — applied inline as `style={{ color: "var(--text)" }}` rather than in Tailwind utility classes
- App language is **Portuguese (pt-BR)**

### Path alias

`@/` maps to the root of `apps/web/` (see `tsconfig.json`).

### Routes

| Path | Description |
|---|---|
| `/` | Home (static) |
| `/reviews` | Review list (fetches from API) |
| `/reviews/[slug]` | Review detail |
| `/reviews/new` | Create review (auth-gated) |
| `/forum` | Forum topic list (fetches from API) |
| `/forum/[slug]` | Thread detail |
| `/forum/new` | Create thread (auth-gated) |
| `/login`, `/register`, `/forgot-password` | Auth flows |
| `/confirm-email/[token]` | Email confirmation |
| `/profile` | User profile (auth-gated) |
