# Plano Admin: Forum

**Status:** Planejado em 18 de junho de 2026.

**Objetivo:** Implementar `/admin/forum` com listagem paginada de topicos, pesquisa, detalhe, link publico e exclusao moderativa por admin.

**Arquitetura:** A API expõe endpoints administrativos de forum protegidos por `@Roles("admin")`. A listagem retorna topicos publicados e nao deletados com autor, contadores e votos. O detalhe inclui conteudo completo, metricas e posts recentes. A exclusao reaproveita `DeleteForumTopicUseCase`, mantendo o comportamento atual de soft delete e a remocao do documento de busca pelo fluxo existente.

---

## Contratos HTTP

```http
GET /admin/forum/topics?q=&page=1&limit=10
GET /admin/forum/topics/:id
DELETE /admin/forum/topics/:id
```

Protecao:

- Usuario autenticado.
- `@Roles("admin")`.

Resposta da lista:

```json
{
  "topics": [
    {
      "id": "uuid",
      "slug": "duvida-civic-2018",
      "title": "Duvida sobre Civic 2018",
      "author": {
        "id": "uuid",
        "username": "johndoe"
      },
      "postsCount": 0,
      "upvotes": 0,
      "downvotes": 0,
      "status": "published",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

Resposta do detalhe:

```json
{
  "id": "uuid",
  "slug": "duvida-civic-2018",
  "title": "Duvida sobre Civic 2018",
  "content": "Texto completo",
  "author": {
    "id": "uuid",
    "username": "johndoe"
  },
  "recentPosts": [
    {
      "id": "uuid",
      "content": "Resposta recente",
      "author": {
        "id": "uuid",
        "username": "janedoe"
      },
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "metrics": {
    "postsCount": 0,
    "upvotes": 0,
    "downvotes": 0
  },
  "status": "published",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

Regras:

- `q` filtra por titulo, conteudo e username do autor.
- `page` minimo `1`.
- `limit` padrao `10`, com limite maximo definido pelo padrao do projeto.
- Topicos deletados nao aparecem na listagem admin padrao.
- O link publico no frontend e `/forum/${slug}`.

---

## Backend

Arquivos esperados:

| Acao | Area | Responsabilidade |
|---|---|---|
| Criar | controller admin de forum | Endpoints `/admin/forum/topics` |
| Criar | use case de listagem | Pesquisa, paginacao e agregados |
| Criar | use case de detalhe | Conteudo completo, posts recentes e metricas |
| Criar | handler de exclusao admin | Chamar `DeleteForumTopicUseCase` |
| Modificar | repositorios | Consultas administrativas de topicos |

Tarefas:

- [ ] Criar DTOs de query para `q`, `page` e `limit`.
- [ ] Criar DTOs de resposta para item de lista, detalhe e meta de paginacao.
- [ ] Implementar pesquisa textual por titulo, conteudo e username.
- [ ] Incluir autor, posts, votos, status e data na listagem.
- [ ] Incluir conteudo completo, posts principais recentes e metricas no detalhe.
- [ ] Reutilizar `DeleteForumTopicUseCase` passando o usuario admin autenticado.
- [ ] Confirmar que a exclusao mantem soft delete e remove o documento de busca pelo fluxo existente.
- [ ] Garantir que topicos deletados nao aparecam em listagens publicas nem na listagem admin padrao.

---

## Frontend

Arquivos esperados:

| Acao | Arquivo | Responsabilidade |
|---|---|---|
| Criar | `apps/web/app/admin/forum/page.tsx` | Listagem de topicos |
| Criar | `apps/web/app/admin/forum/[id]/page.tsx` | Detalhe de topico |
| Modificar | `apps/web/api/admin.ts` | Clientes HTTP de forum |
| Reutilizar | shell admin compartilhado | Sidebar e layout |

Chamadas:

- `fetchAdminForumTopics({ q, page, limit })`
- `fetchAdminForumTopicById(id)`
- `deleteAdminForumTopic(id)`

Tarefas:

- [ ] Implementar pesquisa refletida na URL.
- [ ] Implementar paginacao por `page` e `limit` na URL.
- [ ] Renderizar lista/tabela com titulo, autor, posts, votos, status e data.
- [ ] Navegar para `/admin/forum/[id]` ao clicar no topico.
- [ ] Exibir link direto para `/forum/${slug}` no detalhe.
- [ ] Exibir conteudo completo, posts recentes e metricas.
- [ ] Criar botao "Excluir topico" com confirmacao antes do `DELETE`.
- [ ] Redirecionar para `/admin/forum` apos exclusao bem-sucedida.

---

## Testes e Validacao

- [ ] Cobrir listagem paginada.
- [ ] Cobrir busca por titulo, conteudo e autor.
- [ ] Cobrir detalhe por ID.
- [ ] Cobrir exclusao por admin.
- [ ] Validar que topicos deletados nao aparecem mais na listagem publica/admin padrao.
- [ ] Executar `pnpm --filter api test`.
- [ ] Executar `pnpm --filter api build`.
- [ ] Executar `pnpm --filter app lint`.
- [ ] Executar `pnpm --filter app build`.

## Observacoes

- Nao adaptar endpoints publicos do forum para o painel admin.
- A exclusao moderativa deve preservar o soft delete e a consistencia da projecao de busca.
