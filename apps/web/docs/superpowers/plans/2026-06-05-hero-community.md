# HeroCommunity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar um hero section full-width com fundo navy à homepage, contendo título, subtítulo, campo de busca estático e botão de nova avaliação.

**Architecture:** Server Component puro (`HeroCommunity.tsx`) sem estado ou hooks. Token `--hero-bg` adicionado ao `globals.css`. Integrado em `app/page.tsx` antes do container `max-w-[1100px]`.

**Tech Stack:** Next.js 16, Tailwind CSS v4, CSS custom properties (tokens semânticos).

---

## File Map

| Ação | Arquivo | Responsabilidade |
|---|---|---|
| Modify | `apps/web/app/globals.css` | Adicionar tokens `--hero-bg` e `--hero-input-bg` |
| Create | `apps/web/components/HeroCommunity.tsx` | Hero section completo |
| Modify | `apps/web/app/page.tsx` | Importar e renderizar `<HeroCommunity />` |

---

### Task 1: Adicionar tokens de cor do hero em `globals.css`

**Files:**
- Modify: `apps/web/app/globals.css`

- [ ] **Step 1: Adicionar tokens na seção "Backgrounds & Surfaces" do `:root`**

Localizar o bloco (linha ~35):
```css
  --surface-2: #EBEBEB;                     /* secondary surface — slightly darker than surface */
```

Adicionar logo após essa linha, ainda dentro do `:root`:
```css

  /* =============================================
     SEMANTIC TOKENS — Hero
  ============================================= */
  --hero-bg:       #152035; /* Navy escuro do hero da homepage */
  --hero-input-bg: #1e2f45; /* Input dentro do hero — ligeiramente mais claro */
```

- [ ] **Step 2: Expor os tokens no bloco `@theme inline`**

Localizar o bloco `@theme inline` (linha ~92). Dentro dele, após a linha `--color-header-background: var(--header-background);`, adicionar:
```css
  --color-hero-bg:       var(--hero-bg);
  --color-hero-input-bg: var(--hero-input-bg);
```

- [ ] **Step 3: Verificar lint**

```bash
cd apps/web && pnpm lint
```
Esperado: sem erros.

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/globals.css
git commit -m "feat(web): add hero-bg and hero-input-bg CSS tokens"
```

---

### Task 2: Criar o componente `HeroCommunity`

**Files:**
- Create: `apps/web/components/HeroCommunity.tsx`

- [ ] **Step 1: Criar o arquivo com o markup completo**

```tsx
import Link from "next/link";

export function HeroCommunity() {
  return (
    <section
      className="w-full py-16 px-6"
      style={{ background: "var(--hero-bg)" }}
    >
      <div className="max-w-[800px] mx-auto flex flex-col items-center text-center gap-3">
        <h1
          className="font-display font-extrabold text-4xl sm:text-5xl leading-tight"
          style={{ color: "var(--palette-white)" }}
        >
          Avaliações da Comunidade
        </h1>
        <p
          className="text-base sm:text-lg"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          Descubra opiniões reais de quem realmente dirigiu
        </p>

        <div className="w-full flex flex-col sm:flex-row gap-3 mt-5">
          <input
            type="text"
            placeholder="Buscar por marca, modelo ou categoria..."
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none border"
            style={{
              background: "var(--hero-input-bg)",
              borderColor: "rgba(255,255,255,0.12)",
              color: "var(--palette-white)",
            }}
          />
          <Link
            href="/reviews/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors"
            style={{
              background: "var(--accent)",
              color: "var(--palette-white)",
            }}
          >
            + Nova avaliação
          </Link>
        </div>
      </div>
    </section>
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
git add apps/web/components/HeroCommunity.tsx
git commit -m "feat(web): add HeroCommunity hero section component"
```

---

### Task 3: Integrar `HeroCommunity` na homepage

**Files:**
- Modify: `apps/web/app/page.tsx`

- [ ] **Step 1: Adicionar o import**

No topo de `apps/web/app/page.tsx`, junto aos imports existentes, adicionar:
```tsx
import { HeroCommunity } from "@/components/HeroCommunity";
```

- [ ] **Step 2: Renderizar o componente antes do `<main>`**

Localizar o trecho:
```tsx
		<Nav />
		<main className="flex-1" style={{ background: "var(--bg)" }}>
```

Substituir por:
```tsx
		<Nav />
		<HeroCommunity />
		<main className="flex-1" style={{ background: "var(--bg)" }}>
```

- [ ] **Step 3: Verificar lint**

```bash
cd apps/web && pnpm lint
```
Esperado: sem erros.

- [ ] **Step 4: Verificar visualmente no browser**

```bash
cd /Users/nathanbaldez/Documents/papoauto && pnpm dev --filter=web
```

Abrir `http://localhost:3001` e confirmar:
- Hero com fundo navy aparece entre o header e o conteúdo principal
- Título "Avaliações da Comunidade" em branco, grande e em negrito
- Subtítulo "Descubra opiniões reais de quem realmente dirigiu" em branco com opacidade reduzida
- Campo de busca e botão "+ Nova avaliação" lado a lado em desktop
- Em mobile (< 640px): campo e botão empilhados verticalmente
- Botão navega para `/reviews/new`
- Seções "Avaliações recentes" e "Destaques do fórum" abaixo, sem regressão

- [ ] **Step 5: Commit**

```bash
git add apps/web/app/page.tsx
git commit -m "feat(web): integrate HeroCommunity into homepage"
```
