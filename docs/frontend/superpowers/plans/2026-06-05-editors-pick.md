# EditorsPick Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar o componente `EditorsPick` e integrá-lo na homepage substituindo o `FeaturedReviewCard` + `SectionHeader` atual.

**Architecture:** Server Component puro que recebe `review: PublicReview` como prop. Layout two-column: conteúdo à esquerda, área de imagem placeholder à direita. Fundo navy reutilizando o token `--hero-bg` já existente. A homepage remove o bloco antigo e passa `featuredReview` para o novo componente, preservando o fallback de estado vazio.

**Tech Stack:** Next.js 16, Tailwind CSS v4, CSS custom properties (`var(--hero-bg)`, `var(--accent)`, `var(--palette-white)`), TypeScript.

---

## File Map

| Ação | Arquivo | Responsabilidade |
|---|---|---|
| Create | `apps/web/components/EditorsPick.tsx` | Novo componente de destaque do editor |
| Modify | `apps/web/app/page.tsx` | Substituir `SectionHeader` + `FeaturedReviewCard` por `EditorsPick` |

---

### Task 1: Criar o componente `EditorsPick`

**Files:**
- Create: `apps/web/components/EditorsPick.tsx`

- [ ] **Step 1: Criar o arquivo com o conteúdo completo**

```tsx
import Link from "next/link";
import type { PublicReview } from "@/types";

type EditorsPickProps = {
  review: PublicReview;
};

export function EditorsPick({ review }: EditorsPickProps) {
  const href =
    "slug" in review && review.slug
      ? `/reviews/${review.slug}`
      : `/reviews/${review.id}`;

  const carName = review.vehicle
    ? `${review.vehicle.brand} ${review.vehicle.model}`
    : review.title;

  const year = review.vehicle?.year ?? null;

  return (
    <div
      className="rounded-2xl p-8 flex flex-col md:flex-row gap-8 md:items-center"
      style={{ background: "var(--hero-bg)" }}
    >
      {/* Coluna esquerda — conteúdo */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Badge */}
        <span
          className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
          style={{ background: "var(--accent)", color: "var(--palette-white)" }}
        >
          ★ Escolha do editor
        </span>

        {/* Nome e ano */}
        <div>
          <h2
            className="font-display font-extrabold text-3xl sm:text-4xl leading-tight"
            style={{ color: "var(--palette-white)" }}
          >
            {carName}
          </h2>
          {year !== null && (
            <p className="text-base mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>
              {year}
            </p>
          )}
        </div>

        {/* Score badge */}
        <span className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-full text-sm font-bold bg-white/10">
          <span className="text-yellow-400">★</span>
          <span style={{ color: "var(--palette-white)" }}>{review.score}</span>
          <span className="text-xs font-normal" style={{ color: "rgba(255,255,255,0.6)" }}>
            /5
          </span>
        </span>

        {/* Headline */}
        <p className="text-lg font-bold" style={{ color: "var(--palette-white)" }}>
          {review.title}
        </p>

        {/* Excerpt */}
        {review.excerpt && (
          <p
            className="text-sm leading-relaxed line-clamp-3"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            {review.excerpt}
          </p>
        )}

        {/* CTA */}
        <Link
          href={href}
          className="self-start inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-colors"
          style={{ background: "var(--accent)", color: "var(--palette-white)" }}
        >
          Ler avaliação completa →
        </Link>
      </div>

      {/* Coluna direita — placeholder de imagem */}
      <div className="w-full md:w-[42%] min-h-[180px] md:min-h-[280px] rounded-xl flex items-center justify-center bg-white/5">
        <span className="text-5xl">🚗</span>
      </div>
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
git add apps/web/components/EditorsPick.tsx
git commit -m "feat(web): add EditorsPick component"
```

---

### Task 2: Integrar `EditorsPick` na homepage

**Files:**
- Modify: `apps/web/app/page.tsx`

- [ ] **Step 1: Substituir os imports**

Localizar no topo de `apps/web/app/page.tsx`:
```tsx
import { FeaturedReviewCard } from "@/components/FeaturedReviewCard";
import { Footer } from "@/components/Footer";
import { ForumThreadRow } from "@/components/ForumThreadRow";
import { Nav } from "@/components/Nav";
import { ReviewCard } from "@/components/ReviewCard";
import { SectionHeader } from "@/components/SectionHeader";
import { fetchForumTopics } from "@/api/forum";
import { fetchPublicReviews } from "@/api/reviews";
```

Substituir por:
```tsx
import { EditorsPick } from "@/components/EditorsPick";
import { Footer } from "@/components/Footer";
import { ForumThreadRow } from "@/components/ForumThreadRow";
import { Nav } from "@/components/Nav";
import { ReviewCard } from "@/components/ReviewCard";
import { SectionHeader } from "@/components/SectionHeader";
import { fetchForumTopics } from "@/api/forum";
import { fetchPublicReviews } from "@/api/reviews";
```

- [ ] **Step 2: Substituir o bloco "Escolha do editor"**

Localizar o bloco da section (linhas 40–60):
```tsx
					<section>
						<SectionHeader title="Escolha do editor" />
						{featuredReview ? (
							<FeaturedReviewCard review={featuredReview} />
						) : (
							<div
								className="rounded-2xl border px-5 py-6"
								style={{
									background: "var(--surface)",
									borderColor: "var(--border)",
								}}
							>
								<p
									className="text-[14px]"
									style={{ color: "var(--text-muted)" }}
								>
									Ainda não há avaliações publicadas.
								</p>
							</div>
						)}
					</section>
```

Substituir por:
```tsx
					{featuredReview && (
						<section>
							<EditorsPick review={featuredReview} />
						</section>
					)}
```

- [ ] **Step 3: Verificar lint**

```bash
cd apps/web && pnpm lint
```
Esperado: sem erros.

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/page.tsx
git commit -m "feat(web): replace FeaturedReviewCard with EditorsPick on homepage"
```
