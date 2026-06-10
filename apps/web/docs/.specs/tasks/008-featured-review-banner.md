# Task 008 — Componente FeaturedReviewBanner na Página de Avaliações

## Contexto

A página `/reviews` precisa de um componente de destaque para a avaliação com maior score, exibido logo abaixo do cabeçalho da página e antes do painel de filtros + grid. O layout de referência está salvo em:

```txt
apps/web/docs/.specs/tasks/page_avaliacoes_avaliacao_destaque.jpg
```

A referência mostra um card full-width com fundo laranja (`var(--accent)`), badge "AVALIAÇÃO EM DESTAQUE", nome do veículo em destaque, segmento, título da review, excerpt, metadados (comentários, úteis, autor, data) e botão "Ler avaliação completa →".

## Objetivo

Criar o componente `FeaturedReviewBanner` e integrá-lo em `app/reviews/page.tsx` entre o cabeçalho da página e o componente `ReviewsFilter`.

## Escopo

### Incluído

- Criar `apps/web/app/reviews/FeaturedReviewBanner.tsx`.
- Integrar em `apps/web/app/reviews/page.tsx`:
  - Extrair a avaliação com maior score do array `reviews`.
  - Renderizar `<FeaturedReviewBanner />` entre o header e o `<ReviewsFilter />`.
  - O `ReviewsFilter` deve receber apenas as reviews restantes (excluindo a featured).

### Fora do escopo

- Alterar `ReviewsFilter`, `ReviewCard`, ou outros componentes existentes.
- Implementar lógica de votação ("úteis").
- Alterar rotas, autenticação ou contratos de API.

## Requisitos visuais

- Fundo: `var(--accent)` (laranja), `rounded-2xl`, `p-8`.
- Layout em coluna única, full-width dentro do container da página.

### Estrutura interna (de cima para baixo):

1. **Linha superior**:
   - Esquerda: badge `"★ AVALIAÇÃO EM DESTAQUE"` — pílula com fundo `rgba(0,0,0,0.15)`, texto branco, `text-xs font-bold uppercase tracking-wider`.
   - Direita: score badge — pílula branca com `★` amarela + score bold + `/5` muted escuro, `text-sm`.

2. **Nome do veículo**: `${vehicle.brand} ${vehicle.model} ${vehicle.year}` — `font-extrabold text-2xl sm:text-3xl`, branco. Fallback: `review.title`.

3. **Segmento**: `vehicle.brand` (usado como categoria por ora) — `text-sm uppercase tracking-wide`, branco com opacidade 70%. Omitir se `vehicle` for `undefined`.

4. **Título da review** (`review.title`): `font-bold text-lg`, branco, `mt-3`.

5. **Excerpt** (`review.excerpt`): `text-sm leading-relaxed`, branco com opacidade 80%, `line-clamp-3`.

6. **Linha de metadados**:
   - `MessageSquare` icon (`size={14}`) + `"{commentsCount} comentários"` — branco/70%, `text-sm`.
   - Separador `·`
   - `"{author} · {date}"` — branco/70%, `text-sm`.

7. **Botão CTA**: `"Ler avaliação completa →"` — fundo branco, texto `var(--accent)`, `font-semibold`, `rounded-lg`, `px-5 py-2.5`, `self-start`, `hover:brightness-95`.

## Requisitos responsivos

- Full-width dentro do container `max-w` da página.
- A linha de metadados pode quebrar em `flex-wrap` em mobile.

## Requisitos técnicos

- Server Component puro — sem `"use client"`, sem hooks.
- Prop: `review: PublicReview`.
- Link do CTA:
  ```ts
  const href = review.slug ? `/reviews/${review.slug}` : `/reviews/${review.id}`;
  ```
- Nome do veículo:
  ```ts
  const carName = review.vehicle
    ? `${review.vehicle.brand} ${review.vehicle.model} ${review.vehicle.year}`
    : review.title;
  ```
- Integração em `page.tsx`:
  ```ts
  const featured = [...reviews].sort((a, b) => b.score - a.score)[0];
  const rest = reviews.filter((r) => r.id !== featured?.id);
  ```
  Passar `rest` para `<ReviewsFilter items={...} />` e `featured` para `<FeaturedReviewBanner review={featured} />`.
- Renderizar `<FeaturedReviewBanner />` somente se `featured` existir.

## Arquivos prováveis

- `apps/web/app/reviews/FeaturedReviewBanner.tsx` — criar
- `apps/web/app/reviews/page.tsx` — integrar

## Critérios de aceite

- Card laranja full-width aparece entre o header da página e o filtro/grid.
- Badge "AVALIAÇÃO EM DESTAQUE" visível no topo esquerdo.
- Score badge branco no topo direito.
- Nome do veículo grande e em branco.
- Título, excerpt e metadados exibidos corretamente.
- Botão "Ler avaliação completa →" navega para a rota correta.
- O grid de reviews abaixo não exibe a review em destaque (sem duplicata).
- `pnpm --filter app lint` passa.
- Sem regressão em outras páginas.
