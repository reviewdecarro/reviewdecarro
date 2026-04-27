# ReviewDeCarro — Especificação do Produto

## Visão Geral

ReviewDeCarro é uma plataforma comunitária onde usuários podem escrever e ler reviews detalhadas de versões de carros. O formato é inspirado em fóruns: cada versão de carro tem sua própria "thread" de reviews, onde a comunidade avalia, comenta e vota nas avaliações uns dos outros.

O foco é o mercado brasileiro de automóveis. A navegação parte da busca por marca, modelo e versão, e culmina numa página de reviews com discussões estruturadas.

---

## Domínios

### 1. Catálogo de Carros

Hierarquia: **Marca → Modelo → Versão**.

- Gerenciado por administradores (não pelo usuário final).
- Cada **Versão** (`CarVersion`) tem: ano, nome da versão, motor, câmbio e slug único.
- O slug é usado nas URLs públicas (ex: `/carros/volkswagen/polo/polo-track-1-0-2024`).

### 2. Reviews

Núcleo da aplicação. Um usuário autenticado escreve uma review para uma versão específica de carro.

Cada review contém:
- Título e conteúdo (texto longo)
- Prós e contras
- Tempo de posse e quilometragem
- Nota geral (score)
- Ratings estruturados por categoria (ver abaixo)

### 3. Ratings por Categoria

Cada review pode ter ratings em até 8 categorias independentes:

| Categoria | Descrição |
|-----------|-----------|
| `consumption` | Consumo de combustível |
| `maintenance` | Custo de manutenção |
| `reliability` | Confiabilidade/durabilidade |
| `comfort` | Conforto |
| `performance` | Desempenho |
| `technology` | Tecnologia embarcada |
| `finish` | Acabamento |
| `resale_value` | Valor de revenda |

### 4. Comentários

Usuários autenticados podem comentar em qualquer review. Formato flat (sem thread aninhada).

### 5. Votos

Usuários autenticados podem votar em reviews com `UP` ou `DOWN`. Um usuário só pode ter um voto por review (upsert).

---

## Perfis de Usuário

| Papel | Permissões |
|-------|-----------|
| `USER` | Criar/editar/deletar próprias reviews, comentar, votar |
| `ADMIN` | Tudo do USER + gerenciar catálogo de carros |

Ao registrar, o usuário recebe o papel `USER` por padrão.

---

## API — Endpoints

### Autenticação (já implementado)

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `POST` | `/users/register` | Público | Cria conta |
| `POST` | `/users/login` | Público | Login, retorna JWT |
| `GET` | `/users/:username` | Público | Perfil público do usuário |

### Catálogo de Carros

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `GET` | `/brands` | Público | Lista todas as marcas |
| `GET` | `/brands/:brandSlug/models` | Público | Lista modelos de uma marca |
| `GET` | `/brands/:brandSlug/models/:modelSlug/versions` | Público | Lista versões de um modelo |
| `POST` | `/brands` | ADMIN | Cria marca |
| `POST` | `/brands/:brandSlug/models` | ADMIN | Cria modelo |
| `POST` | `/brands/:brandSlug/models/:modelSlug/versions` | ADMIN | Cria versão |

### Reviews

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `GET` | `/reviews` | Público | Lista reviews (com filtros: `carVersionId`, `username`, `q`) |
| `GET` | `/reviews/:reviewId` | Público | Detalhe de uma review |
| `POST` | `/reviews` | Autenticado | Cria review |
| `PATCH` | `/reviews/:reviewId` | Autor | Edita review |
| `DELETE` | `/reviews/:reviewId` | Autor ou ADMIN | Remove review |

### Comentários

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `GET` | `/reviews/:reviewId/comments` | Público | Lista comentários de uma review |
| `POST` | `/reviews/:reviewId/comments` | Autenticado | Cria comentário |
| `DELETE` | `/reviews/:reviewId/comments/:commentId` | Autor ou ADMIN | Remove comentário |

### Votos

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `POST` | `/reviews/:reviewId/vote` | Autenticado | Registra ou atualiza voto (`UP`/`DOWN`) |
| `DELETE` | `/reviews/:reviewId/vote` | Autenticado | Remove voto |

---

## Frontend — Páginas

### Públicas

| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | Home | Busca de carros + reviews recentes em destaque |
| `/carros` | Catálogo | Lista de marcas |
| `/carros/:brandSlug` | Marca | Modelos de uma marca |
| `/carros/:brandSlug/:modelSlug` | Modelo | Versões de um modelo |
| `/carros/:brandSlug/:modelSlug/:versionSlug` | Versão | Reviews da versão + média de ratings |
| `/reviews/:reviewId` | Review | Conteúdo completo + comentários + votos |
| `/perfil/:username` | Perfil | Reviews e atividade do usuário |

### Autenticadas

| Rota | Página | Descrição |
|------|--------|-----------|
| `/login` | Login | Formulário de autenticação |
| `/registro` | Registro | Criação de conta |
| `/reviews/nova` | Nova review | Formulário de criação de review (seleciona versão) |
| `/reviews/:reviewId/editar` | Editar review | Edição de review própria |

---

## Fluxos Principais

### Fluxo 1 — Buscar e ler uma review

```
Home → busca por modelo
  → Página da Versão (lista de reviews com score médio)
    → Clica em uma review
      → Página da Review (conteúdo, ratings, comentários, votos)
```

### Fluxo 2 — Escrever uma review

```
Login
  → "Escrever review" (botão no header ou na página da versão)
    → Seletor de Marca > Modelo > Versão
      → Formulário de review (título, conteúdo, prós/contras, ratings, score)
        → Submit → redireciona para a review criada
```

### Fluxo 3 — Interagir com uma review

```
Página da Review
  → Voto (UP/DOWN) → autenticação requerida
  → Comentário → autenticação requerida
```

---

## Estrutura de Código Planejada

### API (`apps/api/src/domain/`)

```
domain/
├── users/          ✅ implementado
├── cars/
│   ├── entities/   Brand, Model, CarVersion
│   ├── repositories/
│   ├── use-cases/  ListBrands, ListModels, ListVersions, CreateBrand, CreateModel, CreateVersion
│   └── dtos/
├── reviews/
│   ├── entities/   Review, ReviewRating
│   ├── repositories/
│   ├── use-cases/  CreateReview, GetReview, ListReviews, UpdateReview, DeleteReview
│   └── dtos/
├── comments/
│   ├── entities/   Comment
│   ├── repositories/
│   ├── use-cases/  CreateComment, ListComments, DeleteComment
│   └── dtos/
└── votes/
    ├── entities/   ReviewVote
    ├── repositories/
    ├── use-cases/  UpsertVote, DeleteVote
    └── dtos/
```

### Web (`apps/web/app/`)

```
app/
├── page.tsx                  Home
├── login/page.tsx
├── registro/page.tsx
├── carros/
│   ├── page.tsx              Catálogo
│   ├── [brandSlug]/
│   │   ├── page.tsx          Marca
│   │   └── [modelSlug]/
│   │       ├── page.tsx      Modelo
│   │       └── [versionSlug]/
│   │           └── page.tsx  Versão
├── reviews/
│   ├── nova/page.tsx
│   ├── [reviewId]/
│   │   ├── page.tsx
│   │   └── editar/page.tsx
└── u/[username]/page.tsx
```

---

## Estado Atual e Próximos Passos

### Concluído

- [x] Autenticação JWT (registro, login)
- [x] Schema Prisma completo (todos os modelos)
- [x] Infraestrutura base (NestJS + Next.js + Docker + CI)

### A Implementar — Backend

- [x] Criar papel `USER` no registro (`Role` default)
- [x] Domínio `cars` (entidades, repositórios, use cases, controller)
- [x] Domínio `reviews` (entidades, repositórios, use cases, controller)
- [x] Domínio `comments` (entidades, repositórios, use cases, controller)
- [x] Domínio `votes` (entidades, repositórios, use cases, controller)
- [ ] Guard de autorização por papel (`ADMIN`)
- [ ] Guard de propriedade (autor da review/comentário)
- [ ] Endpoint `GET /reviews` com filtros e paginação
- [ ] Atualizar e2e tests

### A Implementar — Frontend

- [ ] Remover conteúdo de template (home page, README)
- [ ] Integração com API (autenticação, token JWT no header)
- [ ] Todas as páginas listadas acima
- [ ] Componentes: `ReviewCard`, `RatingBar`, `CommentList`, `VoteButtons`, `CarSelector`

---

## Decisões Técnicas

- **Slugs** de carros são gerados no momento de criação e armazenados no banco (não calculados).
- **Paginação** em listagens usa cursor-based (por `createdAt` + `id`) para estabilidade.
- **Ratings** são opcionais por categoria — uma review pode ter apenas score geral sem detalhar categorias.
- **Busca** (`GET /reviews?q=`) faz full-text search no título e conteúdo (via `tsquery` do Postgres ou `ILIKE` em uma primeira versão).
- **Autenticação** no frontend usa cookies `httpOnly` com o JWT, gerenciado via middleware do Next.js.
