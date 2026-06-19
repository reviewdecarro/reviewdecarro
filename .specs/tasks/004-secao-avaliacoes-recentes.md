# Task 004 — Refatoração da Seção "Avaliações Recentes"

## Contexto

A seção de avaliações recentes da homepage precisa ser refatorada para seguir o layout visual de referência salvo em:

```txt
apps/web/docs/.specs/tasks/avaliacoes_recentes.jpg
```

A referência mostra um cabeçalho de seção com ícone de estrela amarela, título grande e link "Ver todas →" à direita, seguido de um grid de 4 colunas com cards redesenhados.

## Objetivo

Refatorar a seção "Avaliações Recentes" da homepage criando um novo componente `RecentReviewCard` (sem alterar o `ReviewCard` existente, que é usado em outras páginas) e atualizando o `SectionHeader` para suportar um ícone opcional.

## Escopo

### Incluído

- Adicionar prop opcional `icon?: React.ReactNode` ao `SectionHeader`.
- Criar `components/RecentReviewCard.tsx` com o novo layout visual.
- Atualizar `app/page.tsx`:
  - Substituir `<ReviewCard>` por `<RecentReviewCard>` na seção de avaliações recentes.
  - Atualizar `<SectionHeader>` com ícone de estrela e texto "Ver todas →" (sem "as avaliações").
- Renomear visualmente a seção de "Avaliações recentes" para "Avaliações Recentes" (capitalizado, conforme referência).

### Fora do escopo

- Alterar o componente `ReviewCard` existente (usado na página `/reviews`).
- Alterar rotas, autenticação ou contratos de API.
- Alterar a lógica de fetch de avaliações.

## Requisitos visuais

### Cabeçalho da seção

- Ícone: estrela amarela (⭐ `text-yellow-400`) à esquerda do título, tamanho ~`text-2xl`.
- Título: `"Avaliações Recentes"` — `font-extrabold`, `text-2xl` ou maior, cor `var(--text)`.
- Link "Ver todas →": cor `var(--accent)`, à direita, `text-sm font-medium`.

### Card (`RecentReviewCard`)

- Fundo: `var(--surface)` (cinza claro), bordas arredondadas (`rounded-xl`), borda sutil (`var(--border)`).
- Hover: leve elevação (`translateY(-2px)`) e sombra (`box-shadow`).
- **Linha superior:** nome do veículo (bold, `var(--text)`) à esquerda + score badge à direita.
  - Nome: `${vehicle.brand} ${vehicle.model} ${vehicle.year}` — ex.: `BMW 320i 2014`. Fallback para `review.title` se `vehicle` for `undefined`.
  - Score badge inline: estrela amarela `★` + score em bold + `/5` em muted — tudo na mesma linha, sem componente `ScoreBadge` separado.
- **Excerpt:** `review.excerpt` em `text-sm`, cor `var(--text-muted)`, `line-clamp-2`, abaixo do nome.
- **Rodapé:** `author · date · 🗨 commentsCount` em `text-xs`, `var(--text-muted)`.
  - Separador: ponto (`·`) entre campos.
  - Ícone de comentário: `MessageSquare` do `lucide-react`, `size={12}`.

## Requisitos responsivos

- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, gap `gap-4` ou `gap-5`.
- Em mobile, cards em coluna única; em tablet, 2 colunas; em desktop, 4 colunas.

## Requisitos técnicos

- `RecentReviewCard` recebe `review: PublicReview` como prop.
- `"use client"` necessário no `RecentReviewCard` pelo hover state (`useState`).
- Não usar `ScoreBadge` nem `TagBadge` — o card tem layout próprio.
- O link do card deve seguir a lógica:
  ```ts
  const href = review.slug ? `/reviews/${review.slug}` : `/reviews/${review.id}`;
  ```
- Nome do veículo com fallback:
  ```ts
  const carName = review.vehicle
    ? `${review.vehicle.brand} ${review.vehicle.model} ${review.vehicle.year}`
    : review.title;
  ```

## Arquivos prováveis

- `apps/web/components/SectionHeader.tsx` — adicionar prop `icon`
- `apps/web/components/RecentReviewCard.tsx` — criar
- `apps/web/app/page.tsx` — atualizar seção de avaliações recentes

## Critérios de aceite

- Cabeçalho com ícone de estrela amarela, título "Avaliações Recentes" e link "Ver todas →" em laranja.
- Cards exibem nome do veículo + score inline, excerpt e rodapé com author/date/comments.
- Grid de 4 colunas em desktop, responsivo em mobile.
- Hover com elevação e sombra funcionando.
- `ReviewCard` original não foi alterado.
- `pnpm --filter app lint` passa.
- Sem regressão nas outras seções da homepage.
