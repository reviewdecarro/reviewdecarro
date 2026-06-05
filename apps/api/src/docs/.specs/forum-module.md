# Plano de Implementação — Módulo de Fórum

## 1. Objetivo

Implementar um módulo de fórum simples e escalável no backend do projeto.

O módulo deve permitir que:

- Usuários autenticados criem tópicos.
- Tópicos recebam respostas.
- Respostas recebam respostas.
- Tópicos recebam upvotes/downvotes.
- Respostas recebam upvotes/downvotes.

---

## 2. Escopo da primeira versão

### Incluído no MVP

- Criação de tópicos.
- Listagem de tópicos.
- Busca de tópico por slug.
- Criação de respostas.
- Criação de respostas aninhadas.
- Voto em tópicos.
- Voto em respostas.
- Soft delete estrutural no schema.
- Contadores de respostas, visualizações e votos.

### Fora do MVP

- Categorias.
- Tags.
- Bookmarks.
- Follow de tópicos.
- Notificações.
- Moderação avançada.
- Melhor resposta.
- Sistema de reputação.
- Busca full-text.

---

## 3. Decisão arquitetural

O fórum será implementado como um único módulo/domínio:

```txt
src/application/forum

Entidades: 
- ForumTopic
- ForumPost
- ForumVote

ForumTopic:

id
authorId
title
slug
content
status
viewsCount
postsCount
upvotes
downvotes
createdAt
updatedAt
deletedAt

ForumPost

id
topicId
authorId
parentPostId
content
status
upvotes
downvotes
createdAt
updatedAt
deletedAt

ForumVote

id
userId
targetId
targetType
value
createdAt
updatedAt

```

```js
// Prisma Schema:
enum ForumTopicStatus {
  PUBLISHED
  DELETED
}

enum ForumPostStatus {
  PUBLISHED
  DELETED
}

enum ForumVoteValue {
  UP
  DOWN
}

enum ForumVoteTargetType {
  TOPIC
  POST
}

model ForumTopic {
  id          String           @id @default(uuid())
  authorId    String

  title       String
  slug        String           @unique
  content     String
  status      ForumTopicStatus @default(PUBLISHED)

  viewsCount  Int              @default(0)
  postsCount  Int              @default(0)
  upvotes     Int              @default(0)
  downvotes   Int              @default(0)

  author      User             @relation(fields: [authorId], references: [id])
  posts       ForumPost[]

  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
  deletedAt   DateTime?

  @@index([authorId])
  @@index([status])
  @@index([createdAt])
  @@index([slug])
  @@map("forum_topics")
}

model ForumPost {
  id            String          @id @default(uuid())
  topicId       String
  authorId      String
  parentPostId  String?

  content       String
  status        ForumPostStatus @default(PUBLISHED)

  upvotes       Int             @default(0)
  downvotes     Int             @default(0)

  topic         ForumTopic      @relation(fields: [topicId], references: [id])
  author        User            @relation(fields: [authorId], references: [id])

  parentPost    ForumPost?      @relation("ForumPostReplies", fields: [parentPostId], references: [id])
  replies       ForumPost[]     @relation("ForumPostReplies")

  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  deletedAt     DateTime?

  @@index([topicId])
  @@index([authorId])
  @@index([parentPostId])
  @@index([status])
  @@index([createdAt])
  @@map("forum_posts")
}

model ForumVote {
  id         String              @id @default(uuid())
  userId     String
  targetId   String
  targetType ForumVoteTargetType
  value      ForumVoteValue

  user       User                @relation(fields: [userId], references: [id])

  createdAt  DateTime            @default(now())
  updatedAt  DateTime            @updatedAt

  @@unique([userId, targetId, targetType])
  @@index([targetId, targetType])
  @@index([userId])
  @@map("forum_votes")
}

```

### Atualizar o model User

```js
model User {
  // campos existentes...

  forumTopics ForumTopic[]
  forumPosts  ForumPost[]
  forumVotes  ForumVote[]
}
```

### 4. Regras de negócio

#### Tópicos:

- Apenas usuários autenticados podem criar tópicos.
- Todo tópico deve ter title, slug e content.
- O slug deve ser único.
- Tópicos iniciam com status PUBLISHED.
- Tópicos deletados devem usar soft delete.
- Tópicos deletados não devem aparecer nas consultas públicas.
- Ao buscar um tópico por slug, incrementar viewsCount.

#### Votos:

- Usuário autenticado pode votar em tópico.
- Usuário autenticado pode votar em resposta.
- O voto pode ser UP ou DOWN.
- Um usuário só pode ter um voto por target.
- O target pode ser TOPIC ou POST.

##### Comportamento esperado

```txt
Sem voto + UP
→ cria voto UP
→ incrementa upvotes

Sem voto + DOWN
→ cria voto DOWN
→ incrementa downvotes

UP + UP
→ remove voto
→ decrementa upvotes

DOWN + DOWN
→ remove voto
→ decrementa downvotes

UP + DOWN
→ atualiza voto para DOWN
→ decrementa upvotes
→ incrementa downvotes

DOWN + UP
→ atualiza voto para UP
→ decrementa downvotes
→ incrementa upvotes
```

