# Reviews Banner Search Implementation Plan

> **For agentic workers:** Implement the tasks in order and keep the search URL-driven so server-rendered results remain shareable.

**Goal:** Transformar o campo do banner de `/reviews` em uma busca funcional que atualiza a URL e a listagem após 300 ms de debounce.

**Architecture:** O banner continua sendo um Server Component reutilizável e recebe um controle de busca client-side. A página lê `searchParams.q`, consulta a API e renderiza o resultado filtrado. O endpoint existente `GET /reviews?q=...` passa a buscar também pelos dados relacionados do veículo.

**Tech Stack:** Next.js 16 App Router, React 19, NestJS, Prisma, Jest, Tailwind CSS v4.

---

## File Map

| Ação | Arquivo | Responsabilidade |
|---|---|---|
| Modify | `apps/web/components/HeroCommunity.tsx` | Aceitar um controle de busca customizado |
| Create | `apps/web/app/reviews/ReviewsSearchInput.tsx` | Sincronizar o campo do banner com `?q=` usando debounce |
| Modify | `apps/web/app/reviews/page.tsx` | Buscar pelo termo e refletir resultados, destaque e estados vazios |
| Modify | `apps/web/api/reviews.ts` | Enviar o parâmetro opcional `q` para a API |
| Modify | Repositórios de reviews da API | Pesquisar título, conteúdo, marca, modelo e versão |
| Modify | Teste do caso de uso de listagem | Cobrir todos os campos pesquisáveis |

---

## Tasks

- [x] Adicionar slot opcional de busca ao `HeroCommunity`, preservando o input padrão para outros consumidores.
- [x] Criar o campo client-side com valor inicial vindo da URL, debounce de 300 ms e `router.replace` sem scroll.
- [x] Fazer a página de reviews ler `searchParams`, consultar `fetchPublicReviews({ query })` e ocultar o destaque durante buscas.
- [x] Exibir todos os resultados no grid durante buscas e mensagens distintas para catálogo vazio e busca sem correspondência.
- [x] Ampliar o cliente HTTP e o filtro `q` dos repositórios Prisma e em memória.
- [x] Atualizar testes da API e executar testes direcionados, lint e builds.

## Acceptance Criteria

- O campo é preenchido ao abrir `/reviews?q=...`.
- Digitar atualiza a URL e a listagem após 300 ms; limpar remove `q`.
- A busca ignora maiúsculas e minúsculas e considera título, conteúdo, marca, modelo e versão.
- O destaque aparece somente sem termo de busca.
- Contagem e estado vazio correspondem aos resultados retornados.
- O CTA de nova avaliação e os filtros laterais permanecem inalterados.
