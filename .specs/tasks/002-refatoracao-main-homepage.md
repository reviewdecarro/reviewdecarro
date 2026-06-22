# Task 002 — Refatoração da Main da Homepage

## Contexto

A seção principal da homepage precisa ser refatorada para seguir o layout visual de referência salvo em:

```txt
apps/web/docs/.specs/tasks/main-page-papoauto.png.jpg
```

A referência mostra duas mudanças estruturais em relação ao estado atual:

1. Um **hero section** de largura total com fundo escuro (navy), contendo título, subtítulo, campo de busca e botão de nova avaliação.
2. Um **card de avaliação em destaque** redesenhado com fundo na cor primária da marca (laranja), badge "AVALIAÇÃO EM DESTAQUE", título do carro, categoria, headline e nota visíveis em texto branco.

## Objetivo

Refatorar a `main` da homepage (`app/page.tsx`) e o componente `FeaturedReviewCard` para ficarem consistentes com o print de referência, preservando as seções de avaliações recentes e destaques do fórum.

## Escopo

### Incluído

- Adicionar um hero section de largura total antes do container `max-w-[1100px]`.
- O hero deve conter:
  - Título: `Avaliações da Comunidade`
  - Subtítulo: `Descubra opiniões reais de quem realmente dirigiu`
  - Campo de busca com placeholder `Buscar por marca, modelo ou categoria...`
  - Botão `+ Nova avaliação` com cor primária
- O campo de busca no hero é visual por ora (não precisa implementar lógica de busca funcional).
- O botão `+ Nova avaliação` deve navegar para `/reviews/new`.
- Redesenhar o `FeaturedReviewCard` para ter fundo na cor primária (`var(--accent)`), texto branco, badge "AVALIAÇÃO EM DESTAQUE" e score badge com fundo branco.
- Renomear o label da seção de "Escolha do editor" para "Avaliação em destaque" no badge interno do card.
- Remover o título de seção `SectionHeader` da seção "Escolha do editor", pois a referência não exibe esse cabeçalho acima do card destacado.
- Manter as seções "Avaliações recentes" e "Destaques do fórum" abaixo do container com `max-w-[1100px]`.

### Fora do escopo

- Implementar lógica de busca (backend, filtros, debounce, etc.).
- Alterar rotas, autenticação ou contratos de API.
- Redesenhar os `ReviewCard`s da seção de avaliações recentes.
- Redesenhar a seção de destaques do fórum.
- Criar novas páginas.

## Requisitos visuais

### Hero section

- Fundo escuro (navy), cobrindo 100% da largura da viewport — sem `max-w-[1100px]`.
- Padding vertical generoso (referência: ~`py-16` ou `py-20`).
- Título centralizado, branco, fonte display, tamanho grande (`text-4xl` ou maior).
- Subtítulo centralizado, branco com opacidade reduzida, tamanho menor.
- Linha inferior com campo de busca à esquerda e botão `+ Nova avaliação` à direita, centralizados no container interno.
- Campo de busca: fundo ligeiramente mais claro que o hero, texto branco, borda sutil, arredondado.
- Botão `+ Nova avaliação`: cor `var(--accent)`, texto branco, arredondado, label com ícone de `+`.
- Em mobile: campo de busca e botão empilhados verticalmente.

### Card de avaliação em destaque

- Fundo: `var(--accent)` (laranja da marca).
- Todo o texto: branco.
- Badge `AVALIAÇÃO EM DESTAQUE` no topo esquerdo, com ícone de estrela, sobre fundo ligeiramente mais escuro (overlay ou `var(--accent-hover)`).
- Nome do carro (marca + modelo + ano): grande, negrito, branco.
- Categoria do veículo (ex.: `SEDAN`): pequeno, uppercase, branco com opacidade reduzida, abaixo do nome.
- Headline da avaliação (`review.title`): negrito, branco.
- Excerpt (`review.excerpt`): menor, branco com leve transparência.
- Score badge: pílula branca com estrela amarela e texto `score /5` em escuro — posicionada no topo direito.

## Requisitos responsivos

- O hero deve ser full-width em qualquer largura.
- Em desktop, campo de busca e botão ficam lado a lado na mesma linha dentro do hero.
- Em mobile (`< sm`), campo de busca e botão empilham verticalmente com largura total.
- O card de avaliação em destaque mantém layout de coluna única em mobile.

## Requisitos técnicos

- Preferir tokens semânticos de `globals.css`; evitar cores hardcoded.
- A cor de fundo do hero não possui token definido atualmente. Usar `#1a2b3c` ou definir `--hero-bg` em `globals.css` como novo token semântico.
- Não duplicar lógica de autenticação.
- O campo de busca pode ser um `<input>` simples sem estado ou handler por ora.
- Preservar todas as props e lógica de dados existentes em `FeaturedReviewCard` — apenas a apresentação visual muda.
- Manter `"use client"` no `FeaturedReviewCard` (já usa `useState` para hover).

## Arquivos prováveis

- `apps/web/app/page.tsx`
- `apps/web/components/FeaturedReviewCard.tsx`
- `apps/web/app/globals.css` (se adicionar token `--hero-bg`)

## Critérios de aceite

- O hero section aparece full-width com fundo navy antes das seções de conteúdo.
- Título, subtítulo, campo de busca e botão `+ Nova avaliação` estão visíveis no hero.
- O botão `+ Nova avaliação` navega para `/reviews/new`.
- O `FeaturedReviewCard` exibe fundo laranja, texto branco, badge "AVALIAÇÃO EM DESTAQUE" e score badge branco.
- As seções "Avaliações recentes" e "Destaques do fórum" continuam funcionais e visíveis abaixo.
- Sem regressão de layout em mobile.
- Sem sobreposição de elementos em larguras comuns de desktop e mobile.
- `pnpm --filter app lint` passa.
