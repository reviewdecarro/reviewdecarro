# Design — Componente HeroCommunity

**Data:** 2026-06-05
**Task relacionada:** `docs/.specs/tasks/002-refatoracao-main-homepage.md`
**Referência visual:** `docs/.specs/tasks/componente-avalicacoes-comunidade.png.jpg`

---

## Objetivo

Adicionar um hero section de largura total à homepage, exibindo título, subtítulo, campo de busca estático e botão de nova avaliação, conforme o print de referência.

## Escopo

- Criar `components/HeroCommunity.tsx` (Server Component).
- Adicionar token `--hero-bg` em `app/globals.css`.
- Integrar o componente em `app/page.tsx` antes do container `max-w-[1100px]`.

**Fora do escopo:** lógica de busca funcional, redesign do `FeaturedReviewCard`, alterações nas seções de avaliações recentes e fórum.

## Arquitetura

### `components/HeroCommunity.tsx`

Server Component puro — sem `"use client"`, sem estado, sem hooks.

**Estrutura de markup:**

```
<section>                    ← full-width, background var(--hero-bg), py-16
  <div>                      ← max-w-[800px] mx-auto px-6, texto centrado
    <h1>                     ← "Avaliações da Comunidade", branco, font-display, text-4xl/5xl, font-extrabold
    <p>                      ← "Descubra opiniões reais de quem realmente dirigiu", branco/70, text-base/lg, mt-3
    <div>                    ← flex row desktop / col mobile, gap-3, mt-8, max-w-[680px] mx-auto
      <input>                ← busca estática, flex-1, background escuro, borda sutil, texto branco, rounded-xl
      <Link href="/reviews/new">  ← estilizado como botão primário, var(--accent), texto branco, rounded-xl
```

### Token CSS novo

```css
--hero-bg: #152035;  /* Navy escuro do hero da homepage */
```

Adicionado na seção de tokens semânticos de `app/globals.css`.

### Integração em `app/page.tsx`

```tsx
<Nav />
<HeroCommunity />          {/* antes do container de conteúdo */}
<main className="flex-1" style={{ background: "var(--bg)" }}>
  <div className="max-w-[1100px] mx-auto px-6 py-10 flex flex-col gap-14">
    ...seções existentes...
  </div>
</main>
<Footer />
```

## Decisões de design

| Decisão | Escolha | Motivo |
|---|---|---|
| `"use client"` | Não | Sem estado ou hooks; Server Component é mais simples e correto |
| Botão para deslogados | Navega direto para `/reviews/new` | A rota já tem guard server-side; não duplicar lógica de auth |
| Input de busca | Estático (sem handler) | Lógica de busca está fora do escopo desta task |
| Token de cor | `--hero-bg` em globals.css | Evita hardcode; permite ajuste global |
| Container interno | `max-w-[800px]` | Mantém legibilidade do título sem esticar demais em telas largas |

## Critérios de aceite

- Hero aparece full-width com fundo navy antes do conteúdo principal.
- Título, subtítulo, input e botão estão visíveis e alinhados conforme referência.
- Em desktop: input e botão lado a lado.
- Em mobile: input e botão empilhados verticalmente com largura total.
- Botão `+ Nova avaliação` navega para `/reviews/new`.
- Seções abaixo (avaliações recentes, fórum) continuam funcionais e sem regressão.
- `pnpm --filter app lint` passa.
