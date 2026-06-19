# Admin Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a protected `/admin` route accessible only to authenticated users with the `admin` role, with a scalable base layout and proper access-denied handling for all other cases.

**Architecture:** The API already queries `roles` when fetching a user but does not expose them in `UserResponseDto` — a small API change is needed first. On the web side, the existing `useAuthSession` hook is extended to expose `roles` and an `isAdmin` flag. Next.js middleware handles the unauthenticated redirect at the edge (no page render flash). The client component handles the role check (admin vs. non-admin), since roles are not embedded in the JWT. The admin page follows the same server/client split used throughout the app (`page.tsx` + `admin-client.tsx`).

**Tech Stack:** NestJS (API), Next.js 16 (web), class-transformer, Tailwind CSS v4, Lucide React, `useAuthSession` hook, Next.js Middleware.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `apps/api/src/application/users/dtos/create-user.dto.ts` | Add `roles` field to `UserResponseDto` |
| Modify | `apps/web/lib/auth.ts` | Add `roles` to `AuthUser` type |
| Modify | `apps/web/hooks/use-auth-session.tsx` | Parse `roles` from `/auth/me`; expose `isAdmin` |
| Create | `apps/web/middleware.ts` | Edge middleware: redirect unauthenticated users away from `/admin` |
| Create | `apps/web/app/admin/page.tsx` | Server component: renders Nav + admin client + Footer |
| Create | `apps/web/app/admin/admin-client.tsx` | Client component: loading / access-denied / admin dashboard states |

---

## Task 1: Expose roles in UserResponseDto (API)

**Files:**
- Modify: `apps/api/src/application/users/dtos/create-user.dto.ts`

The `UserEntity` already has `roles?: RoleEntity[]` and `findById` queries with `include: { roles: true }`. The mapper uses `excludeExtraneousValues: true`, so we only need to add an `@Expose()` property to `UserResponseDto`.

- [ ] **Step 1: Add roles to UserResponseDto**

Replace the full content of `apps/api/src/application/users/dtos/create-user.dto.ts`:

```typescript
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "johndoe", minLength: 3 })
  @IsString()
  @MinLength(3)
  readonly username: string;

  @ApiProperty({ example: "john@email.com" })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: "12345678", minLength: 8 })
  @IsString()
  @MinLength(8)
  readonly password: string;
}

class RoleDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class UserResponseDto {
  @ApiProperty({ example: "uuid-123" })
  @Expose()
  id: string;

  @ApiProperty({ example: "johndoe" })
  @Expose()
  username: string;

  @ApiProperty({ example: "john@email.com" })
  @Expose()
  email: string;

  @ApiProperty({ example: "2026-01-01T00:00:00.000Z" })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: true })
  @Expose()
  active: boolean;

  @ApiProperty({ type: [RoleDto] })
  @Expose()
  @Type(() => RoleDto)
  roles: RoleDto[];
}
```

- [ ] **Step 2: Verify the API builds**

```bash
pnpm build --filter=api
```
Expected: build succeeds with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/application/users/dtos/create-user.dto.ts
git commit -m "feat(api): expose roles in UserResponseDto"
```

---

## Task 2: Add roles to AuthUser type (web)

**Files:**
- Modify: `apps/web/lib/auth.ts`

- [ ] **Step 1: Update AuthUser type**

Replace the full content of `apps/web/lib/auth.ts`:

```typescript
export type AuthUser = {
  username: string;
  email: string;
  roles?: string[];
};
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/lib/auth.ts
git commit -m "feat(web): add roles to AuthUser type"
```

---

## Task 3: Parse roles in useAuthSession and expose isAdmin

**Files:**
- Modify: `apps/web/hooks/use-auth-session.tsx`

- [ ] **Step 1: Update the hook**

Replace the full content of `apps/web/hooks/use-auth-session.tsx`:

```tsx
"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { API_BASE_URL } from "@/api/api";
import type { AuthUser } from "@/api/auth";

type AuthSessionContextValue = {
  authUser: AuthUser | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isCheckingSession: boolean;
  storeAuthUser(user: AuthUser): void;
  removeAuthUser(): void;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    async function syncSession() {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: "include",
          cache: "no-store",
        });

        if (response.status === 401) {
          if (active) setAuthUser(null);
          return;
        }

        if (!response.ok) {
          throw new Error("Falha ao validar a sessão.");
        }

        const data = (await response.json()) as {
          user?: {
            username: string;
            email: string;
            roles?: { name: string }[];
          } | null;
        };

        if (active) {
          if (data.user) {
            setAuthUser({
              username: data.user.username,
              email: data.user.email,
              roles: data.user.roles?.map((r) => r.name) ?? [],
            });
          } else {
            setAuthUser(null);
          }
        }
      } catch {
        if (active) setAuthUser(null);
      } finally {
        if (active) setIsCheckingSession(false);
      }
    }

    void syncSession();

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      authUser,
      isLoggedIn: Boolean(authUser),
      isAdmin: authUser?.roles?.includes("admin") ?? false,
      isCheckingSession,
      storeAuthUser(user: AuthUser) {
        setAuthUser(user);
      },
      removeAuthUser() {
        setAuthUser(null);
      },
    }),
    [authUser, isCheckingSession],
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }

  return context;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm build --filter=web
```
Expected: build succeeds with no type errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/hooks/use-auth-session.tsx
git commit -m "feat(web): parse roles from /auth/me and expose isAdmin flag"
```

---

## Task 4: Add Next.js middleware for unauthenticated redirect

**Files:**
- Create: `apps/web/middleware.ts`

The middleware runs on the edge before the page renders. It checks for the presence of the `papoauto_access_token` cookie. If the cookie is missing, the user is not authenticated and is redirected to `/login?next=/admin` immediately — no JS needs to load, no page flashes.

The middleware does **not** check the admin role because the JWT payload only contains `sub` and `sessionId` — role verification is left to the client component.

- [ ] **Step 1: Create middleware.ts**

Create `apps/web/middleware.ts` at the root of `apps/web/`:

```typescript
import { type NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "papoauto_access_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = request.cookies.has(AUTH_COOKIE);

  if (pathname.startsWith("/admin") && !hasToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

- [ ] **Step 2: Remove the useEffect redirect from admin-client.tsx**

Since middleware now handles the unauthenticated redirect, the `useEffect` + `useRouter` redirect in the client component is no longer needed. The client component only needs to handle the role check.

Note: remove `useRouter` import and the `useEffect` block (shown in Task 5 — the client component is written without them from the start).

- [ ] **Step 3: Commit**

```bash
git add apps/web/middleware.ts
git commit -m "feat(web): add edge middleware to redirect unauthenticated users from /admin"
```

---

## Task 5: Create the admin page server component

**Files:**
- Create: `apps/web/app/admin/page.tsx`

- [ ] **Step 1: Create admin directory and page**

Create `apps/web/app/admin/page.tsx`:

```tsx
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { AdminClient } from "./admin-client";

export const metadata: Metadata = {
  title: "Admin | PapoAuto",
};

export default function AdminPage() {
  return (
    <>
      <Nav />
      <main className="flex-1" style={{ background: "var(--bg)" }}>
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <AdminClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/admin/page.tsx
git commit -m "feat(web): add admin page server component"
```

---

## Task 6: Create the admin client component with role guard

**Files:**
- Create: `apps/web/app/admin/admin-client.tsx`

Middleware already guarantees only authenticated users reach this component. The client component only needs to handle two remaining states:
1. **Loading** — session check (role hydration) in progress
2. **Access denied** — authenticated but not admin
3. **Admin dashboard** — authenticated admin user

- [ ] **Step 1: Create admin-client.tsx**

Create `apps/web/app/admin/admin-client.tsx`:

```tsx
"use client";

import {
  FileText,
  LayoutDashboard,
  LoaderCircle,
  MessageSquare,
  ShieldAlert,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useAuthSession } from "@/hooks/use-auth-session";

const adminNavItems = [
  { icon: LayoutDashboard, label: "Visão geral", href: "/admin", active: true },
  { icon: Users, label: "Usuários", href: "/admin/users", active: false },
  { icon: FileText, label: "Avaliações", href: "/admin/reviews", active: false },
  { icon: MessageSquare, label: "Fórum", href: "/admin/forum", active: false },
];

export function AdminClient() {
  const { authUser, isAdmin, isCheckingSession } = useAuthSession();

  if (isCheckingSession) {
    return (
      <div
        className="rounded-2xl border p-6 text-[14px]"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--text-muted)",
        }}
      >
        <LoaderCircle size={16} className="mr-2 inline animate-spin" />
        Validando permissões...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="rounded-2xl border p-8 text-center"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: "oklch(0.97 0.04 25)", color: "oklch(0.45 0.17 25)" }}
        >
          <ShieldAlert size={24} strokeWidth={1.8} />
        </div>
        <h1
          className="font-display font-extrabold text-[22px] mb-2"
          style={{ color: "var(--text)" }}
        >
          Acesso negado
        </h1>
        <p
          className="text-[14px] mb-6 max-w-[340px] mx-auto"
          style={{ color: "var(--text-muted)" }}
        >
          Você não tem permissão para acessar esta área. Esta seção é restrita a administradores.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[14px] font-semibold text-white"
          style={{ background: "var(--accent)" }}
        >
          Voltar para o início
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside
        className="rounded-2xl border p-3 h-fit"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <p
          className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em]"
          style={{ color: "var(--text-muted)" }}
        >
          Administração
        </p>
        <nav className="grid gap-1">
          {adminNavItems.map(({ icon: Icon, label, href, active }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors"
              style={{
                background: active ? "var(--accent-tint)" : "transparent",
                color: active ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              <Icon size={16} strokeWidth={1.8} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="grid gap-4">
        <div>
          <h1
            className="font-display font-extrabold text-[28px] leading-tight"
            style={{ color: "var(--text)" }}
          >
            Painel de administração
          </h1>
          <p className="mt-1 text-[14px]" style={{ color: "var(--text-muted)" }}>
            Bem-vindo, {authUser!.username}. Esta é a área administrativa do PapoAuto.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Usuários", value: "—", description: "Total de usuários cadastrados" },
            { label: "Avaliações", value: "—", description: "Avaliações publicadas" },
            { label: "Tópicos do fórum", value: "—", description: "Tópicos criados" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border px-5 py-4"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </p>
              <p
                className="mt-1 text-[28px] font-display font-extrabold"
                style={{ color: "var(--text)" }}
              >
                {stat.value}
              </p>
              <p className="mt-0.5 text-[12px]" style={{ color: "var(--text-muted)" }}>
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        <div
          className="rounded-2xl border px-5 py-5"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
            As funcionalidades de gestão serão adicionadas em versões futuras.
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build and verify no type errors**

```bash
pnpm build --filter=web
```
Expected: build succeeds with no type errors.

- [ ] **Step 3: Start dev server and manually verify all states**

```bash
pnpm dev --filter=web
```

Open `http://localhost:3001/admin` and verify:

1. **Unauthenticated:** browser redirects immediately to `/login?next=/admin` (handled by middleware — no spinner shown)
2. **Logged in without admin role:** shows "Acesso negado" with a back button
3. **Logged in with admin role:** shows the admin dashboard with sidebar nav and stat cards

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/admin/admin-client.tsx
git commit -m "feat(web): add admin client component with role guard and base dashboard"
```

---

## Self-Review

### Spec Coverage

| Spec requirement | Covered |
|-----------------|---------|
| Only authenticated users can access | ✅ Task 4 — middleware redirects to `/login` when cookie is absent |
| Only users with `admin` role can access | ✅ Task 6 — client shows access-denied when `!isAdmin` |
| Unauthenticated → redirect to /login | ✅ Task 4 — edge middleware, no page flash |
| Authenticated without admin → block + access denied | ✅ Task 6 — `ShieldAlert` access denied screen |
| Authenticated admin → allow access | ✅ Task 6 — dashboard shown |
| Loading state while session is checked | ✅ Task 6 — `LoaderCircle` spinner |
| Scalable structure for future admin pages | ✅ Task 6 — sidebar nav with placeholder links |
| Role exposed on the front end | ✅ Tasks 1–3 — `roles` added to API response → `AuthUser` → `isAdmin` |

### No Placeholders

All steps contain complete code. No TBD/TODO in implementation steps.

### Type Consistency

- `AuthUser.roles` is `string[]` (Task 2)
- `use-auth-session.tsx` maps `roles: { name: string }[]` → `string[]` (Task 3)
- `isAdmin` checks `roles.includes("admin")` (Task 3)
- `admin-client.tsx` uses `isAdmin` and `authUser` from `useAuthSession()` — `authUser!.username` is safe because the `!isAdmin` guard above ensures we only reach this branch when the user is authenticated and admin (Task 6)

All consistent.
