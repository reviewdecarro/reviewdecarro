# Task 005 — Refatoração da Seção "Discussões em Alta"

## Contexto

A seção de destaques do fórum na homepage precisa ser refatorada para seguir o layout visual de referência salvo em:

```txt
apps/web/docs/.specs/tasks/discussoes_em_alta.jpg
```

A referência mostra um novo cabeçalho com ícone de chat laranja, título "Discussões em Alta" e link "Ver todas →", seguido de um grid de 3 colunas com cards com borda lateral laranja, número de votos em destaque, badge de categoria, título e metadados.

## Objetivo

Refatorar a seção "Destaques do fórum" da homepage renomeando-a para "Discussões em Alta", criando um novo componente `DiscussionCard` (sem alterar o `ForumThreadRow` existente, usado na página do fórum) e atualizando a integração em `app/page.tsx`.

## Escopo

### Incluído

- Criar `components/DiscussionCard.tsx` com o novo layout visual.
- Atualizar `app/page.tsx`:
  - Substituir o loop de `<ForumThreadRow>` por grid de `<DiscussionCard>`.
  - Atualizar `<SectionHeader>` com ícone de chat laranja e título "Discussões em Alta".
  - Atualizar link da ação para "Ver todas →" apontando para `/forum`.
  - Limitar a 3 threads exibidas (era sem limite).
- Renomear visualmente a seção de "Destaques do fórum" para "Discussões em Alta".

### Fora do escopo

- Alterar o componente `ForumThreadRow` (usado na página `/forum`).
- Implementar votação interativa no card (exibir apenas o count, sem botão de voto).
- Alterar rotas, autenticação ou contratos de API.
- Alterar a lógica de fetch de threads.

## Requisitos visuais

### Cabeçalho da seção

- Ícone: `MessageSquare` do `lucide-react` em cor `var(--accent)` (laranja), `size={24}`.
- Título: `"Discussões em Alta"` — `font-extrabold`, `text-2xl` ou maior, cor `var(--text)`.
- Link "Ver todas →": cor `var(--accent)`, à direita, `text-sm font-medium`.

### Card (`DiscussionCard`)

- Fundo: branco/`var(--surface)`, borda sutil (`var(--border)`), `rounded-xl`.
- **Borda lateral esquerda:** `border-l-4` na cor `var(--accent)` (laranja) — destaque visual característico.
- Hover: leve elevação (`translateY(-2px)`) e sombra, `transition-all`.
- Layout interno (top → bottom):
  1. **Linha de topo:** ícone trending (`TrendingUp` do lucide, `size={14}`, `var(--text-muted)`) + badge de categoria.
     - Badge de categoria: `thread.category` em uppercase, `text-[11px]`, `font-semibold`, fundo `var(--surface-2)`, bordas arredondadas, `px-2 py-0.5`.
     - Se `thread.category` for `undefined`, omitir o badge.
  2. **Número de votos:** `thread.upvotes` (ou `thread.votes`) — `text-2xl font-extrabold`, cor `var(--text)`.
  3. **Título:** `thread.title` — `font-bold`, `text-sm` ou `text-base`, cor `var(--text)`, `line-clamp-2`.
  4. **Rodapé:** `author · 🕐 date · 🗨 comments` em `text-xs`, `var(--text-muted)`.
     - Ícone de tempo: `Clock` do lucide, `size={12}`.
     - Ícone de comentário: `MessageSquare` do lucide, `size={12}`.

## Requisitos responsivos

- Grid: `grid-cols-1 md:grid-cols-3`, gap `gap-4` ou `gap-5`.
- Em mobile, cards em coluna única; em desktop, 3 colunas.

## Requisitos técnicos

- `DiscussionCard` recebe `thread: ForumTopicSummary` como prop.
- `"use client"` necessário pelo hover state (`useState`).
- Não importar `VoteButton`, `useAuthSession` ou lógica de votação — o card é somente leitura.
- O link do card: `href={`/forum/${thread.slug}`}`.
- Votos a exibir: usar `thread.upvotes` se disponível, com fallback para `thread.votes`:
  ```ts
  const voteCount = thread.upvotes ?? thread.votes ?? 0;
  ```
- `page.tsx` deve limitar as threads a 3:
  ```ts
  const topDiscussions = featuredThreads.slice(0, 3);
  ```
  (o array `featuredThreads` já está ordenado por relevância na lógica existente)

## Arquivos prováveis

- `apps/web/components/DiscussionCard.tsx` — criar
- `apps/web/app/page.tsx` — atualizar seção de discussões

## Critérios de aceite

- Cabeçalho com ícone `MessageSquare` laranja, título "Discussões em Alta" e link "Ver todas →".
- Exatamente 3 cards exibidos no grid.
- Cada card tem borda esquerda laranja, número de votos em destaque, badge de categoria (quando disponível), título e rodapé com metadados.
- Cards são links funcionais para `/forum/[slug]`.
- `ForumThreadRow` original não foi alterado.
- `pnpm --filter app lint` passa.
- Sem regressão nas outras seções da homepage.
