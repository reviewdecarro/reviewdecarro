# Plano Admin: Usuarios

**Status:** Planejado em 18 de junho de 2026.

**Objetivo:** Implementar `/admin/users` com pesquisa por username, paginacao, detalhe do usuario e exclusao administrativa, impedindo que o admin exclua a propria conta por esse fluxo.

**Arquitetura:** A API expõe endpoints administrativos dedicados protegidos por `@Roles("admin")`. A listagem usa filtros e paginacao no repositorio de usuarios. O detalhe agrega dados cadastrais e metricas simples de avaliacoes e topicos. A exclusao reaproveita `DeleteAccountUseCase`, mantendo as regras de dominio existentes.

---

## Contratos HTTP

```http
GET /admin/users?q=&page=1&limit=10
GET /admin/users/:id
DELETE /admin/users/:id
```

Protecao:

- Usuario autenticado.
- `@Roles("admin")`.

Resposta da lista:

```json
{
  "users": [
    {
      "id": "uuid",
      "username": "johndoe",
      "email": "john@email.com",
      "active": true,
      "confirmedEmail": true,
      "roles": ["admin"],
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
  "username": "johndoe",
  "email": "john@email.com",
  "active": true,
  "confirmedEmail": true,
  "roles": ["admin"],
  "createdAt": "2026-01-01T00:00:00.000Z",
  "metrics": {
    "reviewsCount": 0,
    "forumTopicsCount": 0
  }
}
```

Regras:

- `q` filtra por `username` com contains case-insensitive.
- `page` minimo `1`.
- `limit` padrao `10`, com limite maximo definido pelo padrao do projeto.
- `DELETE /admin/users/:id` deve bloquear autoexclusao do admin logado.

---

## Backend

Arquivos esperados:

| Acao | Area | Responsabilidade |
|---|---|---|
| Criar | controller admin de usuarios | Endpoints `/admin/users` |
| Criar | use case de listagem | Pesquisa e paginacao |
| Criar | use case de detalhe | Dados cadastrais e metricas |
| Criar | use case/handler de exclusao admin | Validar autoexclusao e chamar `DeleteAccountUseCase` |
| Modificar | repositorios | Buscar usuarios paginados e contar total |

Tarefas:

- [ ] Criar DTOs de query para `q`, `page` e `limit`.
- [ ] Criar DTOs de resposta para item de lista, detalhe e meta de paginacao.
- [ ] Implementar filtro por username insensitive no repositorio Prisma.
- [ ] Implementar o mesmo contrato nos repositorios in-memory.
- [ ] Agregar metricas de avaliacoes e topicos por usuario no detalhe.
- [ ] Reutilizar `DeleteAccountUseCase` para exclusao.
- [ ] Retornar erro de dominio/HTTP adequado ao tentar excluir o proprio usuario admin.

---

## Frontend

Arquivos esperados:

| Acao | Arquivo | Responsabilidade |
|---|---|---|
| Criar | `apps/web/app/admin/users/page.tsx` | Listagem de usuarios |
| Criar | `apps/web/app/admin/users/[id]/page.tsx` | Detalhe de usuario |
| Modificar | `apps/web/api/admin.ts` | Clientes HTTP de usuarios |
| Reutilizar | shell admin compartilhado | Sidebar e layout |

Chamadas:

- `fetchAdminUsers({ q, page, limit })`
- `fetchAdminUserById(id)`
- `deleteAdminUser(id)`

Tarefas:

- [ ] Implementar pesquisa por username refletida na URL.
- [ ] Implementar paginacao por `page` e `limit` na URL.
- [ ] Renderizar tabela ou lista densa com dados principais.
- [ ] Navegar para `/admin/users/[id]` ao clicar no usuario.
- [ ] Exibir dados cadastrais, roles, status e metricas no detalhe.
- [ ] Criar botao "Excluir usuario" com confirmacao antes do `DELETE`.
- [ ] Redirecionar para a listagem apos exclusao bem-sucedida.

---

## Testes e Validacao

- [ ] Cobrir filtro por username.
- [ ] Cobrir paginacao e calculo de `totalPages`.
- [ ] Cobrir detalhe com metricas.
- [ ] Cobrir exclusao por admin.
- [ ] Cobrir bloqueio de autoexclusao.
- [ ] Executar `pnpm --filter api test`.
- [ ] Executar `pnpm --filter api build`.
- [ ] Executar `pnpm --filter app lint`.
- [ ] Executar `pnpm --filter app build`.

## Observacoes

- A tela deve usar endpoints administrativos dedicados, nao endpoints publicos ou de perfil.
- A exclusao deve preservar o comportamento de dominio existente para contas e dados relacionados.
