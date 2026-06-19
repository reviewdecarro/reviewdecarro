# Plano Admin: Avaliacoes

**Status:** Planejado em 18 de junho de 2026.

**Objetivo:** Implementar `/admin/reviews` com listagem paginada, pesquisa, detalhe, link publico da avaliacao e exclusao moderativa por admin.

**Arquitetura:** A API expõe endpoints administrativos de avaliacoes protegidos por `@Roles("admin")`. A listagem consulta avaliacoes com joins/dados agregados para autor, veiculo e comentarios. O detalhe retorna o conteudo completo e metricas. A exclusao reaproveita `DeleteReviewUseCase`, passando o admin logado e preservando o fluxo ja existente de remocao do documento de busca.

---

## Contratos HTTP

```http
GET /admin/reviews?q=&page=1&limit=10
GET /admin/reviews/:id
DELETE /admin/reviews/:id
```

Protecao:

- Usuario autenticado.
- `@Roles("admin")`.

Resposta da lista:

```json
{
  "reviews": [
    {
      "id": "uuid",
      "slug": "civic-2018-review",
      "title": "Honda Civic 2018",
      "author": {
        "id": "uuid",
        "username": "johndoe"
      },
      "vehicle": {
        "brand": "Honda",
        "model": "Civic",
        "version": "EXL",
        "year": 2018
      },
      "score": 4.5,
      "commentsCount": 0,
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
  "slug": "civic-2018-review",
  "title": "Honda Civic 2018",
  "content": "Texto completo",
  "pros": ["Conforto"],
  "cons": ["Consumo"],
  "ratings": {},
  "author": {
    "id": "uuid",
    "username": "johndoe"
  },
  "vehicle": {
    "brand": "Honda",
    "model": "Civic",
    "version": "EXL",
    "year": 2018
  },
  "metrics": {
    "commentsCount": 0
  },
  "status": "published",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

Regras:

- `q` filtra por titulo, conteudo, username, marca, modelo, versao e ano.
- `page` minimo `1`.
- `limit` padrao `10`, com limite maximo definido pelo padrao do projeto.
- O link publico no frontend e `/reviews/${slug}`.

---

## Backend

Arquivos esperados:

| Acao | Area | Responsabilidade |
|---|---|---|
| Criar | controller admin de avaliacoes | Endpoints `/admin/reviews` |
| Criar | use case de listagem | Pesquisa, paginacao e agregados |
| Criar | use case de detalhe | Conteudo completo e metricas |
| Criar | handler de exclusao admin | Chamar `DeleteReviewUseCase` |
| Modificar | repositorios | Consultas administrativas de reviews |

Tarefas:

- [ ] Criar DTOs de query para `q`, `page` e `limit`.
- [ ] Criar DTOs de resposta para item de lista, detalhe e meta de paginacao.
- [ ] Implementar pesquisa textual nos campos definidos.
- [ ] Incluir autor, veiculo, score, comentarios, status e data na listagem.
- [ ] Incluir conteudo completo, pros/contras, ratings, autor, veiculo e metricas no detalhe.
- [ ] Reutilizar `DeleteReviewUseCase` passando o usuario admin autenticado.
- [ ] Confirmar que a exclusao remove o documento de busca pelo fluxo existente.

---

## Frontend

Arquivos esperados:

| Acao | Arquivo | Responsabilidade |
|---|---|---|
| Criar | `apps/web/app/admin/reviews/page.tsx` | Listagem de avaliacoes |
| Criar | `apps/web/app/admin/reviews/[id]/page.tsx` | Detalhe de avaliacao |
| Modificar | `apps/web/api/admin.ts` | Clientes HTTP de reviews |
| Reutilizar | shell admin compartilhado | Sidebar e layout |

Chamadas:

- `fetchAdminReviews({ q, page, limit })`
- `fetchAdminReviewById(id)`
- `deleteAdminReview(id)`

Tarefas:

- [ ] Implementar pesquisa refletida na URL.
- [ ] Implementar paginacao por `page` e `limit` na URL.
- [ ] Renderizar lista/tabela com titulo, autor, veiculo, score, comentarios, status e data.
- [ ] Navegar para `/admin/reviews/[id]` ao clicar na avaliacao.
- [ ] Exibir link direto para `/reviews/${slug}` no detalhe.
- [ ] Exibir conteudo completo, pros/contras, ratings e metricas.
- [ ] Criar botao "Excluir avaliacao" com confirmacao antes do `DELETE`.
- [ ] Redirecionar para `/admin/reviews` apos exclusao bem-sucedida.

---

## Testes e Validacao

- [ ] Cobrir listagem paginada.
- [ ] Cobrir filtros por texto, autor e veiculo.
- [ ] Cobrir detalhe por ID.
- [ ] Cobrir exclusao por admin.
- [ ] Validar que o link publico e formado pelo slug.
- [ ] Executar `pnpm --filter api test`.
- [ ] Executar `pnpm --filter api build`.
- [ ] Executar `pnpm --filter app lint`.
- [ ] Executar `pnpm --filter app build`.

## Observacoes

- Nao adaptar endpoints publicos de reviews para o painel admin.
- A exclusao moderativa deve preservar as regras ja existentes do dominio e da indexacao de busca.
