# Task 003 — Componente EditorsPick

## Contexto

A homepage precisa de um componente de destaque para a avaliação escolhida pelo editor, substituindo o `FeaturedReviewCard` atual. O novo componente segue o layout de referência salvo em:

```txt
apps/web/docs/.specs/tasks/editors-pick.jpg
```

A referência mostra um card escuro em duas colunas: conteúdo à esquerda (badge, nome do carro, ano, nota, headline, excerpt e botão CTA) e área de imagem do veículo à direita.

## Objetivo

Criar o componente `EditorsPick` e integrá-lo na homepage em substituição ao `FeaturedReviewCard` atual, removendo também o `SectionHeader` "Escolha do editor" (o badge interno ao card já cumpre esse papel).

## Escopo

### Incluído

- Criar `components/EditorsPick.tsx`.
- Integrar em `app/page.tsx` no lugar do bloco atual com `SectionHeader` + `FeaturedReviewCard`.
- Badge "ESCOLHA DO EDITOR" com ícone de estrela, fundo laranja (`var(--accent)`), texto branco uppercase.
- Nome do veículo: `vehicle.brand + " " + vehicle.model` — grande, branco, negrito.
- Ano: `vehicle.year` — menor, branco/muted, abaixo do nome.
- Score badge: pílula escura com estrela amarela e texto `score /5`.
- Headline: `review.title` — negrito, branco.
- Excerpt: `review.excerpt` — menor, branco com opacidade reduzida.
- Botão CTA: "Ler avaliação completa →" — fundo laranja, branco, navega para `/reviews/[slug]` ou `/reviews/[id]`.
- Área de imagem à direita: placeholder com fundo escuro arredondado e emoji 🚗 centralizado (sem campo de imagem na API por ora).
- Remover `SectionHeader` com título "Escolha do editor" e `FeaturedReviewCard` da homepage.

### Fora do escopo

- Implementar upload ou campo de imagem do veículo na API.
- Alterar o componente `FeaturedReviewCard` (pode coexistir para outros usos).
- Alterar rotas, autenticação ou contratos de API.

## Requisitos visuais

### Card

- Fundo: navy escuro — usar `var(--hero-bg)` (`#152035`) para reaproveitar o token existente.
- Bordas arredondadas (`rounded-2xl`).
- Padding interno generoso (`p-8` ou similar).
- Layout two-column: conteúdo à esquerda (~55–60%), imagem à direita (~40–45%).
- Verticalmente alinhado ao centro em ambas as colunas.

### Coluna esquerda (de cima para baixo)

1. **Badge** — pílula laranja (`var(--accent)`), ícone ★ + texto `ESCOLHA DO EDITOR` em uppercase, bold, branco, `text-xs`.
2. **Nome do veículo** — `text-3xl` ou `text-4xl`, `font-extrabold`, branco. Ex.: `FIAT Palio`.
3. **Ano** — `text-base`, branco com opacidade ~65%. Ex.: `2012`.
4. **Score badge** — pílula com fundo escuro (`bg-white/10` ou similar), estrela amarela (★), texto `score /5` em branco, `font-bold`.
5. **Headline** (`review.title`) — `text-lg`, `font-bold`, branco.
6. **Excerpt** (`review.excerpt`) — `text-sm`, branco com opacidade ~75%, até 3 linhas.
7. **Botão CTA** — `"Ler avaliação completa →"`, fundo `var(--accent)`, texto branco, `font-semibold`, arredondado, largura auto (não full-width).

### Coluna direita

- Retângulo com fundo `bg-white/5` ou `bg-slate-700/50`, `rounded-xl`, altura mínima ~220px.
- Emoji 🚗 centralizado, `text-5xl`, como placeholder visual.

## Requisitos responsivos

- Desktop (≥ `md`): layout two-column lado a lado.
- Mobile (< `md`): coluna única — conteúdo empilhado, área de imagem abaixo do conteúdo.
- A área de imagem pode ter altura reduzida em mobile (`min-h-[140px]`).

## Requisitos técnicos

- O componente recebe `review: PublicReview` como prop.
- Sem `"use client"` — Server Component puro (sem estado ou hooks).
- Reutilizar o token `var(--hero-bg)` já definido em `globals.css`.
- Evitar cores hardcoded além das já usadas no projeto (`var(--accent)`, `var(--palette-white)`).
- O link do CTA deve seguir a mesma lógica do `FeaturedReviewCard` existente:
  ```ts
  const href = review.slug ? `/reviews/${review.slug}` : `/reviews/${review.id}`;
  ```
- O nome do veículo deve ter fallback para quando `review.vehicle` for `undefined`:
  ```ts
  const carName = review.vehicle
    ? `${review.vehicle.brand} ${review.vehicle.model}`
    : review.title;
  const year = review.vehicle?.year ?? null;
  ```

## Arquivos prováveis

- `apps/web/components/EditorsPick.tsx` — novo componente (criar)
- `apps/web/app/page.tsx` — substituir bloco "Escolha do editor"

## Critérios de aceite

- O card `EditorsPick` aparece na homepage logo abaixo do header, com fundo navy.
- Badge "ESCOLHA DO EDITOR" visível no topo esquerdo do card.
- Nome do veículo, ano, score, headline e excerpt exibidos corretamente.
- Botão "Ler avaliação completa →" navega para a rota correta da avaliação.
- Área de imagem à direita exibe o placeholder 🚗.
- Layout two-column em desktop, coluna única em mobile.
- `SectionHeader` "Escolha do editor" e `FeaturedReviewCard` removidos da homepage.
- `pnpm --filter app lint` passa.
- Sem regressão nas seções "Avaliações recentes" e "Destaques do fórum".
