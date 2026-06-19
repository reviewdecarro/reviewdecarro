# Plano Admin: Visao Geral

**Status:** Planejado em 18 de junho de 2026.

**Objetivo:** Substituir os cards vazios da rota `/admin` por metricas reais de usuarios, avaliacoes e topicos do forum, usando endpoints administrativos protegidos por role.

**Arquitetura:** Criar um modulo HTTP administrativo dedicado na API, importado pelo modulo HTTP principal. O endpoint de resumo chama um caso de uso especifico, que agrega contagens a partir dos repositorios existentes. No frontend, a pagina `/admin` passa a consumir um cliente HTTP administrativo compartilhado e renderiza os dados dentro de um shell reutilizavel para as telas admin.

---

## Contrato HTTP

```http
GET /admin/summary
```

Protecao:

- Usuario autenticado.
- `@Roles("admin")`.

Resposta:

```json
{
  "usersCount": 0,
  "reviewsCount": 0,
  "forumTopicsCount": 0
}
```

Regras de contagem:

- `usersCount`: usuarios cadastrados/ativos conforme criterio usado pelo repositorio de usuarios.
- `reviewsCount`: avaliacoes publicadas.
- `forumTopicsCount`: topicos publicados e nao deletados.

---

## Backend

Arquivos esperados:

| Acao | Area | Responsabilidade |
|---|---|---|
| Criar | `AdminHttpModule` | Agrupar controllers administrativos |
| Modificar | `HttpModule` | Importar o modulo administrativo |
| Criar | `AdminSummaryController` | Expor `GET /admin/summary` |
| Criar | `AdminSummaryUseCase` | Agregar metricas dos repositorios |
| Modificar | repositorios de usuarios/reviews/forum | Adicionar metodos de contagem quando necessario |

Tarefas:

- [ ] Criar modulo HTTP administrativo dedicado.
- [ ] Criar controller protegido com `@Roles("admin")`.
- [ ] Criar `AdminSummaryUseCase`.
- [ ] Adicionar contratos de contagem nos repositorios de usuarios, avaliacoes e forum.
- [ ] Implementar as contagens nas implementacoes Prisma e in-memory usadas em testes.
- [ ] Garantir que topicos deletados nao entrem no total.

---

## Frontend

Arquivos esperados:

| Acao | Arquivo | Responsabilidade |
|---|---|---|
| Criar | `apps/web/api/admin.ts` | Cliente HTTP para endpoints admin |
| Modificar | `apps/web/app/admin/page.tsx` | Buscar resumo no server/client boundary atual |
| Modificar | `apps/web/app/admin/admin-client.tsx` | Renderizar cards com dados reais |
| Criar/Extrair | componentes admin compartilhados | Shell com sidebar e item ativo por rota |

Tarefas:

- [ ] Criar `fetchAdminSummary()` com `credentials: "include"` e `cache: "no-store"`.
- [ ] Renderizar os tres cards com valores reais.
- [ ] Tratar estado de erro sem quebrar o shell administrativo.
- [ ] Extrair shell compartilhado para `/admin`, `/admin/users`, `/admin/reviews` e `/admin/forum`.
- [ ] Marcar item ativo da sidebar com base na rota atual.

---

## Testes e Validacao

- [ ] Testar `AdminSummaryUseCase` com repositorios in-memory.
- [ ] Testar controller protegido com usuario admin.
- [ ] Testar rejeicao para usuario sem role admin, caso ja exista padrao de teste para guards.
- [ ] Executar `pnpm --filter api test`.
- [ ] Executar `pnpm --filter api build`.
- [ ] Executar `pnpm --filter app lint`.
- [ ] Executar `pnpm --filter app build`.

## Observacoes

- A protecao real fica no backend; a protecao visual do frontend e complementar.
- O endpoint administrativo deve ser independente dos endpoints publicos para evitar acoplamento com formato de cards publicos.
