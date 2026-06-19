# Task 007 — Refatoração da Página de Avaliações

## Contexto

A página `/reviews` precisa ser refatorada para seguir o layout visual de referência salvo em:

```txt
apps/web/docs/.specs/tasks/page_avaliacoes.jpg
```

A referência mostra um layout de duas colunas: painel de filtros à esquerda e grid de cards de avaliação à direita. Os filtros são visuais (não funcionais por ora). O foco principal é o novo design dos cards de avaliação.

## Objetivo

Refatorar a página de avaliações criando um novo componente `ReviewPageCard` para o grid de cards, um componente estático `ReviewsFilterPanel` para o painel de filtros, e atualizando `ReviewsFilter.tsx` para o novo layout de duas colunas.

## Escopo

### Incluído

- Criar `apps/web/app/reviews/ReviewPageCard.tsx` — novo card de avaliação para a página de reviews.
- Criar `apps/web/app/reviews/ReviewsFilterPanel.tsx` — painel de filtros estático (visual apenas, sem lógica).
- Refatorar `apps/web/app/reviews/ReviewsFilter.tsx` — substituir pills de segmento e grid atual pelo novo layout sidebar + grid de 2 colunas.
- Atualizar o header da página: substituir `"Avaliações"` + subtitle por `"N avaliações encontradas"`.

### Fora do escopo

- Implementar lógica de filtro funcional (Marca, Categoria, Ano, Nota mínima, Ordenar por).
- Alterar rotas, autenticação ou contratos de API.
- Alterar o componente `ReviewCard` existente (usado na homepage e outros locais).
- Implementar paginação.

## Requisitos visuais

### Layout geral

- Layout de duas colunas em desktop: sidebar de filtros à esquerda (~280–300px fixo), grid de cards à direita (flex-1).
- Em mobile: sidebar oculta ou empilhada acima do grid (coluna única).
- Background da página: `var(--bg)` (branco).

### Painel de filtros (`ReviewsFilterPanel`)

- Card branco, `rounded-xl`, `border`, `p-5`, sticky no topo (`sticky top-6`).
- Cabeçalho: ícone `SlidersHorizontal` do lucide (`size={16}`, `var(--text-muted)`) + label `"Filtros"` — `font-semibold`, `var(--text)`.
- Campos (todos estáticos, `disabled` ou `readOnly`):
  - **Marca**: label + `<select>` com option `"Todas"`.
  - **Categoria**: label + `<select>` com option `"Todas"`.
  - **Ano**: label + dois `<input type="text">` lado a lado com placeholder `"De"` e `"Até"`.
  - **Nota mínima**: label + `<select>` com option `"Qualquer"`.
  - **Ordenar por**: label + `<select>` com option `"Mais recentes"`.
- Botão `"Limpar filtros"`: largura total, fundo `var(--surface-2)`, cor `var(--text-muted)`, `rounded-lg`.
- Estilo dos inputs/selects: `border border-[var(--border)] rounded-lg px-3 py-2 text-sm w-full bg-white text-[var(--text)]`.
- Labels: `text-sm font-medium text-[var(--text)]`, `mb-1`.

### Card de avaliação (`ReviewPageCard`)

- Fundo branco, `border border-[var(--border)]`, `rounded-xl`, `p-5`.
- Hover: `hover:shadow-md`, sem translate.
- Conteúdo (de cima para baixo):

  1. **Linha superior**: badge de segmento (esquerda) + score (direita).
     - Badge: `vehicle.segment` ou segmento do carro — uppercase, `text-[11px] font-semibold`, fundo `var(--surface-2)`, `px-2 py-0.5 rounded`.
     - Score: `★` amarela + score bold + `/5` muted, alinhado à direita.

  2. **Nome do veículo**: `${vehicle.brand} ${vehicle.model} ${vehicle.year}` — `font-extrabold text-lg`, `var(--text)`. Fallback: `review.title`.

  3. **Excerpt/título**: `review.excerpt` ou `review.title` — `text-sm`, `var(--text-muted)`, `line-clamp-2`.

  4. **Rodapé** (separado por linha horizontal sutil `border-t mt-3 pt-3`):
     - Esquerda: `review.author` — `text-sm font-semibold text-gray-700`.
     - Direita: 👍 likes · 💬 comments · data — `text-xs text-[var(--text-muted)]`.
       - Ícones: `ThumbsUp` e `MessageSquare` do lucide, `size={13}`.
       - Likes: usar `review.votes` se disponível (tipo `Review`), caso contrário omitir ou exibir `0`.
       - Comments: `review.commentsCount` (tipo `PublicReview`) ou `review.comments` (tipo `Review`).
       - Data: `review.date`.

### Header da página

- Substituir título `"Avaliações"` + subtitle por `"{reviews.length} avaliações encontradas"` — `font-extrabold text-2xl`, `var(--text)`.
- Manter o botão `<ReviewCreateButton />` alinhado à direita no mesmo header.

## Requisitos responsivos

- Desktop (≥ `lg`): sidebar à esquerda (largura fixa ~`w-72`) + grid à direita (`grid-cols-2`).
- Tablet (`md`): sidebar oculta, grid de 2 colunas.
- Mobile: coluna única, sidebar oculta.

## Requisitos técnicos

- `ReviewPageCard` é Server Component — sem `"use client"`, hover via Tailwind apenas.
- `ReviewsFilterPanel` é Server Component — sem `"use client"`.
- `ReviewsFilter.tsx` mantém `"use client"` (controla estado dos filtros no futuro).
- O `ReviewPageCard` aceita `review: Review | PublicReview` e `car?: Car` (mesmo contrato do `ReviewCard` atual).
- Link do card: `review.slug ? /reviews/${review.slug} : /reviews/${review.id}`.
- Segmento do badge:
  ```ts
  const segment = "vehicle" in review && review.vehicle
    ? review.vehicle.brand
    : (car?.segment ?? "");
  ```
- Likes com fallback seguro:
  ```ts
  const likesCount = "votes" in review ? review.votes : null;
  ```

## Arquivos prováveis

- `apps/web/app/reviews/ReviewPageCard.tsx` — criar
- `apps/web/app/reviews/ReviewsFilterPanel.tsx` — criar
- `apps/web/app/reviews/ReviewsFilter.tsx` — refatorar layout
- `apps/web/app/reviews/page.tsx` — atualizar header

## Critérios de aceite

- Layout desktop: sidebar de filtros à esquerda + grid de 2 colunas à direita.
- Painel de filtros exibe todos os campos (Marca, Categoria, Ano, Nota mínima, Ordenar por) e botão "Limpar filtros" — visual apenas, sem funcionalidade.
- Cards exibem: badge de segmento, score inline, nome do veículo em destaque, excerpt, rodapé com author/likes/comments/data.
- Header exibe `"N avaliações encontradas"`.
- `ReviewCard` original não foi alterado.
- `pnpm --filter app lint` passa.
- Sem regressão em outras páginas.
