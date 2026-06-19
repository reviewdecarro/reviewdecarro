# Task 006 — Seção CTA e Refatoração do Footer

## Contexto

A homepage precisa de uma seção de call-to-action antes do footer com dois cards de engajamento, e o footer precisa ser refatorado visualmente. O layout de referência está salvo em:

```txt
apps/web/docs/.specs/tasks/footer_homepage.jpg
```

A referência mostra dois cards lado a lado ("Compartilhe sua avaliação" e "Participe do fórum") seguidos de um footer com logo, tagline e links de navegação.

## Objetivo

Criar o componente `CtaSection` com os dois cards de engajamento e refatorar o `Footer` para seguir o visual da referência, integrando ambos na homepage.

## Escopo

### Incluído

- Criar `components/CtaSection.tsx` com os dois cards.
- Refatorar `components/Footer.tsx` para o novo visual.
- Integrar `<CtaSection />` em `app/page.tsx` entre a seção "Discussões em Alta" e o `<Footer />`.

### Fora do escopo

- Alterar rotas, autenticação ou contratos de API.
- Implementar lógica de autenticação dentro da `CtaSection` (os links já têm guard nas rotas).

## Requisitos visuais

### `CtaSection`

Layout de dois cards lado a lado (`grid-cols-1 md:grid-cols-2`), dentro de um container `max-w` centralizado, com padding vertical generoso (`py-16`).

#### Card 1 — "Compartilhe sua avaliação" (fundo accent/laranja)

- Fundo: `var(--accent)` (laranja).
- Ícone: `Star` do lucide em pílula circular com fundo `rgba(255,255,255,0.2)`, no topo esquerdo, tamanho `size={24}`, cor branca.
- Título: `"Compartilhe sua avaliação"` — `font-bold`, `text-xl`, branco.
- Descrição: `"Já teve experiência com algum veículo? Ajude outros entusiastas compartilhando sua opinião sincera."` — branco com opacidade ~80%, `text-sm`.
- Botão: `"Criar avaliação"` — fundo branco, texto `var(--accent)`, `font-semibold`, largura total, `rounded-lg`, navega para `/reviews/new`.

#### Card 2 — "Participe do fórum" (fundo branco com borda)

- Fundo: branco, borda `var(--border)`, `rounded-2xl`.
- Ícone: `PenSquare` (ou `SquarePen`) do lucide em pílula circular com fundo `rgba(200,72,27,0.08)` (accent tint), no topo esquerdo, tamanho `size={24}`, cor `var(--accent)`.
- Título: `"Participe do fórum"` — `font-bold`, `text-xl`, `var(--text)`.
- Descrição: `"Tire dúvidas, compartilhe dicas e conecte-se com outros apaixonados por carros."` — `var(--text-muted)`, `text-sm`.
- Botão: `"Criar tópico"` — fundo `var(--accent)`, texto branco, `font-semibold`, largura total, `rounded-lg`, navega para `/forum/new`.

### `Footer` (refatorado)

- Fundo branco, borda superior sutil (`var(--border)`).
- Layout: logo + tagline à esquerda, links de navegação à direita — mesma linha em desktop, empilhado em mobile.
- **Logo:** `<img src="/logos/papo-auto-logo-color.svg">`, `height: 28px`.
- **Tagline:** `"Avaliações de carros, discussões no fórum e destaques da comunidade."` — `text-[13px]`, `var(--text-muted)`, abaixo da logo.
- **Links:** `Início`, `Avaliações`, `Entrar` (apenas quando deslogado) — `text-[13px]`, `var(--text-muted)`, `hover:opacity-80`.
- Preservar a lógica de `useAuthSession` para o link "Entrar".

## Requisitos responsivos

- `CtaSection`: grid 1 coluna em mobile, 2 colunas em desktop (`md:grid-cols-2`).
- `Footer`: coluna única em mobile, linha em desktop (`sm:flex-row`).

## Requisitos técnicos

- `CtaSection` é Server Component puro — sem `"use client"`, sem hooks.
- `Footer` mantém `"use client"` pois usa `useAuthSession`.
- Botões da `CtaSection` são `<Link>` do Next.js (não `<button>`).
- Usar `hover:brightness-90` nos botões da `CtaSection` para consistência com o restante do projeto.

## Arquivos prováveis

- `apps/web/components/CtaSection.tsx` — criar
- `apps/web/components/Footer.tsx` — refatorar
- `apps/web/app/page.tsx` — adicionar `<CtaSection />` antes do `<Footer />`

## Critérios de aceite

- Card laranja com ícone, título, descrição e botão "Criar avaliação" → `/reviews/new`.
- Card branco com ícone, título, descrição e botão "Criar tópico" → `/forum/new`.
- Cards lado a lado em desktop, empilhados em mobile.
- Footer com logo, tagline e links — visual consistente com a referência.
- Link "Entrar" no footer aparece apenas para usuários deslogados.
- `pnpm --filter app lint` passa.
- Sem regressão nas demais seções da homepage.
