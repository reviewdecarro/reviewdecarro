import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../src/app.module";
import { InMemoryForumPostsRepository } from "../src/application/forum/repositories/in-memory-forum-posts.repository";
import { InMemoryForumTopicsRepository } from "../src/application/forum/repositories/in-memory-forum-topics.repository";
import { InMemoryForumVotesRepository } from "../src/application/forum/repositories/in-memory-forum-votes.repository";
import { ForumPostsRepositoryProps } from "../src/application/forum/repositories/forum-posts.repository";
import { ForumTopicsRepositoryProps } from "../src/application/forum/repositories/forum-topics.repository";
import { ForumVotesRepositoryProps } from "../src/application/forum/repositories/forum-votes.repository";
import { InMemoryRolesRepository } from "../src/application/roles/repositories/in-memory-roles.repository";
import { RolesRepositoryProps } from "../src/application/roles/repositories/roles.repository";
import { InMemoryUserTokensRepository } from "../src/application/users/repositories/in-memory-user-tokens.repository";
import { InMemoryUsersRepository } from "../src/application/users/repositories/in-memory-users.repository";
import { UserTokensRepositoryProps } from "../src/application/users/repositories/user-tokens.repository";
import { UsersRepositoryProps } from "../src/application/users/repositories/users.repository";
import { PrismaService } from "../src/infra/database/prisma/prisma.service";
import { BadRequestInterceptor } from "../src/shared/errors/interceptors/bad-request.interceptor";

describe("Forum auth (e2e)", () => {
  let app: INestApplication;
  let topicsRepo: InMemoryForumTopicsRepository;
  let postsRepo: InMemoryForumPostsRepository;
  let usersRepo: InMemoryUsersRepository;
  let userTokensRepo: InMemoryUserTokensRepository;
  let rolesRepo: InMemoryRolesRepository;
  let topicId: string;
  let postId: string;
  let topicSlug: string;

  beforeAll(async () => {
    topicsRepo = new InMemoryForumTopicsRepository();
    postsRepo = new InMemoryForumPostsRepository();
    usersRepo = new InMemoryUsersRepository();
    userTokensRepo = new InMemoryUserTokensRepository();
    rolesRepo = new InMemoryRolesRepository();

    const topic = await topicsRepo.create("user-1", {
      title: "Melhor hatch para cidade",
      content: "Quero opções econômicas e confortáveis para uso diário.",
      slug: "melhor-hatch-para-cidade",
    });

    const post = await postsRepo.create(topic.id, "user-2", {
      content: "Eu iria de Fit ou Polo.",
    });

    topicId = topic.id;
    postId = post.id;
    topicSlug = topic.slug;

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn(), $disconnect: jest.fn() })
      .overrideProvider(UsersRepositoryProps)
      .useValue(usersRepo)
      .overrideProvider(UserTokensRepositoryProps)
      .useValue(userTokensRepo)
      .overrideProvider(RolesRepositoryProps)
      .useValue(rolesRepo)
      .overrideProvider(ForumTopicsRepositoryProps)
      .useValue(topicsRepo)
      .overrideProvider(ForumPostsRepositoryProps)
      .useValue(postsRepo)
      .overrideProvider(ForumVotesRepositoryProps)
      .useValue(new InMemoryForumVotesRepository())
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalInterceptors(new BadRequestInterceptor());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("allows listing topics without auth", async () => {
    const res = await request(app.getHttpServer() as App).get("/forum/topics");

    expect(res.status).toBe(200);
    expect(res.body.topics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: topicId,
          slug: topicSlug,
        }),
      ]),
    );
  });

  it("allows opening a topic by slug without auth", async () => {
    const res = await request(app.getHttpServer() as App).get(
      `/forum/topics/${topicSlug}`,
    );

    expect(res.status).toBe(200);
    expect(res.body.topic).toMatchObject({
      id: topicId,
      slug: topicSlug,
    });
  });

  it("requires auth to create a topic", async () => {
    const res = await request(app.getHttpServer() as App)
      .post("/forum/topics")
      .send({
        title: "Novo tópico",
        content: "Conteúdo suficientemente longo para passar na validação.",
      });

    expect(res.status).toBe(401);
  });

  it("requires auth to reply to a topic", async () => {
    const res = await request(app.getHttpServer() as App)
      .post(`/forum/topics/${topicId}/posts`)
      .send({
        content: "Minha resposta sem autenticação.",
      });

    expect(res.status).toBe(401);
  });

  it("requires auth to reply to another post", async () => {
    const res = await request(app.getHttpServer() as App)
      .post(`/forum/topics/${topicId}/posts/${postId}/replies`)
      .send({
        content: "Minha réplica sem autenticação.",
      });

    expect(res.status).toBe(401);
  });

  it("requires auth to vote on a topic", async () => {
    const res = await request(app.getHttpServer() as App)
      .post(`/forum/topics/${topicId}/vote`)
      .send({
        value: "UP",
      });

    expect(res.status).toBe(401);
  });

  it("requires auth to vote on a post", async () => {
    const res = await request(app.getHttpServer() as App)
      .post(`/forum/posts/${postId}/vote`)
      .send({
        value: "UP",
      });

    expect(res.status).toBe(401);
  });

  it("requires auth to delete a topic", async () => {
    const res = await request(app.getHttpServer() as App).delete(
      `/forum/topics/${topicId}`,
    );

    expect(res.status).toBe(401);
  });

  it("requires auth to delete a post", async () => {
    const res = await request(app.getHttpServer() as App).delete(
      `/forum/posts/${postId}`,
    );

    expect(res.status).toBe(401);
  });
});
