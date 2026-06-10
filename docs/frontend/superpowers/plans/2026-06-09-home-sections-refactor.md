# Home Sections Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refatorar as seções "Avaliações Recentes" e "Discussões em Alta" da homepage, criando novos componentes `RecentReviewCard` e `DiscussionCard` e atualizando `SectionHeader` para suportar ícone.

**Architecture:** Quatro tasks sequenciais: (1) atualizar `SectionHeader` com prop `icon`, (2) criar `RecentReviewCard`, (3) criar `DiscussionCard`, (4) integrar tudo em `page.tsx`. Nenhum componente existente (`ReviewCard`, `ForumThreadRow`) é alterado.

**Tech Stack:** Next.js 16, Tailwind CSS v4, lucide-react, CSS custom properties, TypeScript.

---

## File Map

| Ação | Arquivo | Responsabilidade |
|---|---|---|
| Modify | `apps/web/components/SectionHeader.tsx` | Adicionar prop `icon?: React.ReactNode` |
| Create | `apps/web/components/RecentReviewCard.tsx` | Card de avaliação recente com layout novo |
| Create | `apps/web/components/DiscussionCard.tsx` | Card de thread do fórum com borda laranja |
| Modify | `apps/web/app/page.tsx` | Integrar novos componentes nas duas seções |

---

### Task 1: Adicionar prop `icon` ao `SectionHeader`

**Files:**
- Modify: `apps/web/components/SectionHeader.tsx`

- [ ] **Step 1: Substituir o conteúdo completo do arquivo**

```tsx
import Link from "next/link";

type SectionHeaderProps = {
  title: string;
  action?: string;
  href?: string;
  icon?: React.ReactNode;
};

export function SectionHeader({ title, action, href, icon }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2
        className="font-display font-extrabold text-[22px] leading-none flex items-center gap-2"
        style={{ color: "var(--text)" }}
      >
        {icon}
        {title}
      </h2>
      {action && href ? (
        <Link
          href={href}
          className="border-none bg-transparent text-[13px] font-medium"
          style={{ color: "var(--accent)" }}
        >
          {action}
        </Link>
      ) : action ? (
        <button
          type="button"
          className="border-none bg-transparent text-[13px] font-medium"
          style={{ color: "var(--accent)" }}
        >
          {action}
        </button>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: Verificar lint**

```bash
cd apps/web && pnpm lint
```
Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add apps/web/components/SectionHeader.tsx
git commit -m "feat(web): add optional icon prop to SectionHeader"
```

---

### Task 2: Criar `RecentReviewCard`

**Files:**
- Create: `apps/web/components/RecentReviewCard.tsx`

- [ ] **Step 1: Criar o arquivo com o conteúdo completo**

```tsx
"use client";

import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { PublicReview } from "@/types";

type RecentReviewCardProps = {
  review: PublicReview;
};

export function RecentReviewCard({ review }: RecentReviewCardProps) {
  const href =
    review.slug ? `/reviews/${review.slug}` : `/reviews/${review.id}`;

  const carName = review.vehicle
    ? `${review.vehicle.brand} ${review.vehicle.model} ${review.vehicle.year}`
    : review.title;

  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block rounded-xl p-4 transition-all duration-200"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: hovered ? "0 6px 24px rgba(0,0,0,0.10)" : "none",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      {/* Linha superior: nome do veículo + score inline */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className="font-bold text-sm leading-snug"
          style={{ color: "var(--text)" }}
        >
          {carName}
        </span>
        <span className="inline-flex items-center gap-0.5 flex-shrink-0">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-sm font-bold" style={{ color: "var(--text)" }}>
            {review.score}
          </span>
          <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>
            /5
          </span>
        </span>
      </div>

      {/* Excerpt */}
      {review.excerpt && (
        <p
          className="text-sm line-clamp-2 mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          {review.excerpt}
        </p>
      )}

      {/* Rodapé: author · date · comments */}
      <div
        className="flex items-center gap-1.5 text-xs flex-wrap"
        style={{ color: "var(--text-muted)" }}
      >
        <span>{review.author}</span>
        <span>·</span>
        <span>{review.date}</span>
        <span>·</span>
        <MessageSquare size={12} strokeWidth={1.8} />
        <span>{review.commentsCount ?? 0}</span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Verificar lint**

```bash
cd apps/web && pnpm lint
```
Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add apps/web/components/RecentReviewCard.tsx
git commit -m "feat(web): add RecentReviewCard component"
```

---

### Task 3: Criar `DiscussionCard`

**Files:**
- Create: `apps/web/components/DiscussionCard.tsx`

- [ ] **Step 1: Criar o arquivo com o conteúdo completo**

```tsx
"use client";

import { Clock, MessageSquare, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ForumTopicSummary } from "@/types";

type DiscussionCardProps = {
  thread: ForumTopicSummary;
};

export function DiscussionCard({ thread }: DiscussionCardProps) {
  const [hovered, setHovered] = useState(false);
  const voteCount = thread.upvotes ?? thread.votes ?? 0;

  return (
    <Link
      href={`/forum/${thread.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block rounded-xl p-4 transition-all duration-200"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderLeft: "4px solid var(--accent)",
        boxShadow: hovered ? "0 6px 24px rgba(0,0,0,0.10)" : "none",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      {/* Linha de topo: ícone trending + badge de categoria */}
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp
          size={14}
          strokeWidth={1.8}
          style={{ color: "var(--text-muted)" }}
        />
        {thread.category && (
          <span
            className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded"
            style={{
              background: "var(--surface-2)",
              color: "var(--text-muted)",
            }}
          >
            {thread.category}
          </span>
        )}
      </div>

      {/* Número de votos */}
      <div
        className="text-2xl font-extrabold mb-1"
        style={{ color: "var(--text)" }}
      >
        {voteCount}
      </div>

      {/* Título */}
      <p
        className="font-bold text-sm leading-snug line-clamp-2 mb-3"
        style={{ color: "var(--text)" }}
      >
        {thread.title}
      </p>

      {/* Rodapé: author · clock · date · comments */}
      <div
        className="flex items-center gap-1.5 text-xs flex-wrap"
        style={{ color: "var(--text-muted)" }}
      >
        <span>{thread.author}</span>
        <span>·</span>
        <Clock size={12} strokeWidth={1.8} />
        <span>{thread.date}</span>
        <span>·</span>
        <MessageSquare size={12} strokeWidth={1.8} />
        <span>{thread.comments}</span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Verificar lint**

```bash
cd apps/web && pnpm lint
```
Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add apps/web/components/DiscussionCard.tsx
git commit -m "feat(web): add DiscussionCard component"
```

---

### Task 4: Integrar os novos componentes em `page.tsx`

**Files:**
- Modify: `apps/web/app/page.tsx`

- [ ] **Step 1: Atualizar os imports**

Localizar o bloco de imports atual no topo de `apps/web/app/page.tsx`:

```tsx
import { EditorsPick } from "@/components/EditorsPick";
import { Footer } from "@/components/Footer";
import { ForumThreadRow } from "@/components/ForumThreadRow";
import { Nav } from "@/components/Nav";
import { ReviewCard } from "@/components/ReviewCard";
import { SectionHeader } from "@/components/SectionHeader";
import { fetchForumTopics } from "@/lib/forum";
import { fetchPublicReviews } from "@/lib/reviews";
```

Substituir por:

```tsx
import { DiscussionCard } from "@/components/DiscussionCard";
import { EditorsPick } from "@/components/EditorsPick";
import { Footer } from "@/components/Footer";
import { MessageSquare } from "lucide-react";
import { Nav } from "@/components/Nav";
import { RecentReviewCard } from "@/components/RecentReviewCard";
import { SectionHeader } from "@/components/SectionHeader";
import { fetchForumTopics } from "@/lib/forum";
import { fetchPublicReviews } from "@/lib/reviews";
```

- [ ] **Step 2: Adicionar a variável `topDiscussions`**

Localizar após a declaração de `latestReviews`:

```tsx
	const latestReviews = reviews
		.filter((review) => review.id !== featuredReview?.id)
		.slice(0, 4);
```

Adicionar logo abaixo:

```tsx
	const topDiscussions = featuredThreads.slice(0, 3);
```

- [ ] **Step 3: Substituir a seção "Avaliações recentes"**

Localizar:

```tsx
					<section>
						<SectionHeader title="Avaliações recentes" action="Ver todas as avaliações" href="/reviews" />
						{latestReviews.length > 0 ? (
							<div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
								{latestReviews.map((review) => (
									<ReviewCard key={review.id} review={review} />
								))}
							</div>
						) : (
							<div
								className="rounded-xl border px-5 py-6"
								style={{
									background: "var(--surface)",
									borderColor: "var(--border)",
								}}
							>
								<p
									className="text-[14px]"
									style={{ color: "var(--text-muted)" }}
								>
									Ainda não há avaliações recentes.
								</p>
							</div>
						)}
					</section>
```

Substituir por:

```tsx
					<section>
						<SectionHeader
							title="Avaliações Recentes"
							action="Ver todas →"
							href="/reviews"
							icon={<span className="text-yellow-400 text-2xl leading-none">★</span>}
						/>
						{latestReviews.length > 0 ? (
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
								{latestReviews.map((review) => (
									<RecentReviewCard key={review.id} review={review} />
								))}
							</div>
						) : (
							<div
								className="rounded-xl border px-5 py-6"
								style={{
									background: "var(--surface)",
									borderColor: "var(--border)",
								}}
							>
								<p
									className="text-[14px]"
									style={{ color: "var(--text-muted)" }}
								>
									Ainda não há avaliações recentes.
								</p>
							</div>
						)}
					</section>
```

- [ ] **Step 4: Substituir a seção "Destaques do fórum"**

Localizar:

```tsx
					<section>
						<SectionHeader
							title="Destaques do fórum"
							action="Ir para o fórum"
							href="/forum"
						/>
						<div className="flex flex-col">
							{featuredThreads.map((thread) => (
								<ForumThreadRow key={thread.id} thread={thread} />
							))}
						</div>
					</section>
```

Substituir por:

```tsx
					<section>
						<SectionHeader
							title="Discussões em Alta"
							action="Ver todas →"
							href="/forum"
							icon={<MessageSquare size={24} style={{ color: "var(--accent)" }} />}
						/>
						{topDiscussions.length > 0 ? (
							<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
								{topDiscussions.map((thread) => (
									<DiscussionCard key={thread.id} thread={thread} />
								))}
							</div>
						) : (
							<div
								className="rounded-xl border px-5 py-6"
								style={{
									background: "var(--surface)",
									borderColor: "var(--border)",
								}}
							>
								<p
									className="text-[14px]"
									style={{ color: "var(--text-muted)" }}
								>
									Ainda não há discussões em alta.
								</p>
							</div>
						)}
					</section>
```

- [ ] **Step 5: Verificar lint**

```bash
cd apps/web && pnpm lint
```
Esperado: sem erros.

- [ ] **Step 6: Commit**

```bash
git add apps/web/app/page.tsx
git commit -m "feat(web): integrate RecentReviewCard and DiscussionCard into homepage"
```
