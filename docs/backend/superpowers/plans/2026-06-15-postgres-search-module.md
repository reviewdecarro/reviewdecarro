# Postgres Full-Text Search Module - Executed Plan

**Status:** Concluído em 15 de junho de 2026.

**Objetivo:** Centralizar a pesquisa de avaliações e tópicos do fórum em uma projeção PostgreSQL, com Full-Text Search em português, tolerância básica a erros via `pg_trgm`, filtros por entidade, paginação e ordenação.

**Arquitetura:** O módulo segue as camadas existentes do projeto. Contratos, DTOs, casos de uso e indexador ficam em `application/search`; a implementação SQL fica no repositório Prisma; o endpoint público fica na camada HTTP; e o `SearchModule` exporta o indexador para os módulos que alteram entidades pesquisáveis.

---

## Resultado implementado

- [x] Criado o modelo Prisma `SearchDocument`, mapeado para `search_documents`.
- [x] Adicionado o enum `SearchEntityType` com `REVIEW` e `TOPIC`.
- [x] Preservado `score` como `Float` e incluído `authorName` para os cards existentes.
- [x] Criada migration manual com `pg_trgm`, `unaccent` e `immutable_unaccent(text)`.
- [x] Criada coluna gerada `searchVector` com pesos por campo.
- [x] Criados índices GIN para FTS e texto normalizado com trigram.
- [x] Criado endpoint público `GET /search`.
- [x] Implementados filtros por tipo, paginação e ordenação por relevância, recência e popularidade.
- [x] Implementada indexação de avaliações e tópicos publicados.
- [x] Conectada a atualização do índice aos fluxos de reviews, tópicos, comentários, respostas e votos.
- [x] Implementada política de melhor esforço: falhas no índice são registradas sem desfazer a operação principal.
- [x] Criado comando idempotente de backfill e reparo do índice.
- [x] Integradas as páginas de reviews e fórum ao novo endpoint quando existe `q`.
- [x] Mantidas as listagens anteriores quando não existe pesquisa.
- [x] Adicionados controles compartilhados de ordenação e paginação no frontend.

## Contrato HTTP

```http
GET /search?q=civic%202018&type=review&sort=relevance&page=1&limit=10
```

Parâmetros:

| Campo | Valores | Padrão |
|---|---|---|
| `q` | texto com até 120 caracteres | vazio |
| `type` | `all`, `review`, `topic` | `all` |
| `sort` | `relevance`, `recent`, `popular` | `relevance` |
| `page` | inteiro maior ou igual a 1 | `1` |
| `limit` | inteiro entre 1 e 50 | `10` |

Resposta:

```json
{
  "items": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

## Relevância e indexação

- FTS utiliza `websearch_to_tsquery('portuguese', ...)`.
- Título, marca e modelo possuem peso `A`.
- Versão e ano possuem peso `B`.
- Conteúdo possui peso `C`.
- O fallback trigram pesquisa título e metadados normalizados do veículo.
- A ordenação de relevância combina FTS, trigram, popularidade e recência.
- Votos são armazenados como saldo; comentários representam comentários de reviews ou posts ativos do tópico.
- Apenas reviews e tópicos públicos são mantidos em `search_documents`.

## Operação

Aplicar migrations:

```bash
cd apps/api
pnpm dlx prisma migrate deploy
```

Reconstruir o índice:

```bash
pnpm --filter api search:reindex
```

Ordem de implantação:

1. Aplicar a migration.
2. Implantar a API com o `SearchModule`.
3. Executar `search:reindex`.
4. Implantar o frontend integrado ao endpoint.

## Validação executada

- [x] Prisma schema validado e client regenerado.
- [x] Migration `20260615120000_add_search_documents` aplicada no PostgreSQL local.
- [x] Extensões `pg_trgm` e `unaccent` confirmadas.
- [x] Índices FTS, trigram e auxiliares confirmados no banco.
- [x] Backfill executado com 3 avaliações e 1 tópico.
- [x] 42 suítes e 112 testes da API passaram.
- [x] Build da API passou.
- [x] Lint e build do frontend passaram.

## Limites do MVP

- Não utiliza Elasticsearch, fila ou worker assíncrono.
- O endpoint aceita `type=all`, mas não foi criada uma página global de pesquisa.
- Alterações futuras nos nomes de marca, modelo ou versão deverão reindexar as avaliações relacionadas.
- Em caso de falha de indexação, o comando `search:reindex` restaura a consistência da projeção.
