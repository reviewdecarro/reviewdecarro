import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../src/app.module";
import { InMemoryVersionsRepository } from "../src/application/cars/repositories/in-memory-versions.repository";
import { VersionsRepositoryProps } from "../src/application/cars/repositories/versions.repository";
import { InMemoryReviewsRepository } from "../src/application/reviews/repositories/in-memory-reviews.repository";
import { ReviewsRepositoryProps } from "../src/application/reviews/repositories/reviews.repository";
import { InMemoryRolesRepository } from "../src/application/roles/repositories/in-memory-roles.repository";
import { RolesRepositoryProps } from "../src/application/roles/repositories/roles.repository";
import { InMemoryUserTokensRepository } from "../src/application/users/repositories/in-memory-user-tokens.repository";
import { InMemoryUsersRepository } from "../src/application/users/repositories/in-memory-users.repository";
import { UserTokensRepositoryProps } from "../src/application/users/repositories/user-tokens.repository";
import { UsersRepositoryProps } from "../src/application/users/repositories/users.repository";
import { PrismaService } from "../src/infra/database/prisma/prisma.service";
import { BadRequestInterceptor } from "../src/shared/errors/interceptors/bad-request.interceptor";

describe("Register → Login → Create Review (e2e)", () => {
  let app: INestApplication;
  let usersRepo: InMemoryUsersRepository;
  let userTokensRepo: InMemoryUserTokensRepository;
  let rolesRepo: InMemoryRolesRepository;
  let reviewsRepo: InMemoryReviewsRepository;
  let versionsRepo: InMemoryVersionsRepository;
  let carVersionId: string;

  beforeAll(async () => {
    usersRepo = new InMemoryUsersRepository();
    userTokensRepo = new InMemoryUserTokensRepository();
    rolesRepo = new InMemoryRolesRepository();
    reviewsRepo = new InMemoryReviewsRepository();
    versionsRepo = new InMemoryVersionsRepository();

    const version = await versionsRepo.create("model-uuid-1", {
      year: 2023,
      versionName: "Civic EX",
      engine: "2.0",
      transmission: "CVT",
      slug: "honda-civic-ex-2023",
    });
    carVersionId = version.id;

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
      .overrideProvider(ReviewsRepositoryProps)
      .useValue(reviewsRepo)
      .overrideProvider(VersionsRepositoryProps)
      .useValue(versionsRepo)
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

  describe("POST /users/register", () => {
    it("creates a new user and returns 201", async () => {
      const res = await request(app.getHttpServer() as App)
        .post("/users/register")
        .send({
          username: "johndoe",
          email: "john@example.com",
          password: "password123",
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe(
        "Usuário cadastrado com sucesso. Um e-mail de confirmação foi enviado.",
      );
      expect(res.body.user).toMatchObject({
        username: "johndoe",
        email: "john@example.com",
      });
      expect(res.body.user.passwordHash).toBeUndefined();
    });

    it("returns 400 when email is already taken", async () => {
      const res = await request(app.getHttpServer() as App)
        .post("/users/register")
        .send({
          username: "janedoe",
          email: "john@example.com",
          password: "password123",
        });

      expect(res.status).toBe(400);
    });

    it("returns 400 when username is already taken", async () => {
      const res = await request(app.getHttpServer() as App)
        .post("/users/register")
        .send({
          username: "johndoe",
          email: "other@example.com",
          password: "password123",
        });

      expect(res.status).toBe(400);
    });

    it("returns 400 when password is too short", async () => {
      const res = await request(app.getHttpServer() as App)
        .post("/users/register")
        .send({
          username: "newuser",
          email: "new@example.com",
          password: "short",
        });

      expect(res.status).toBe(400);
    });

    it("returns 400 when email is invalid", async () => {
      const res = await request(app.getHttpServer() as App)
        .post("/users/register")
        .send({
          username: "newuser",
          email: "not-an-email",
          password: "password123",
        });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /users/login", () => {
    it("returns 200 with access_token for valid credentials", async () => {
      const res = await request(app.getHttpServer() as App)
        .post("/users/login")
        .send({
          email: "john@example.com",
          password: "password123",
        });

      expect(res.status).toBe(200);
      expect(res.body.access_token).toBeDefined();
      expect(typeof res.body.access_token).toBe("string");
    });

    it("returns 400 for wrong password", async () => {
      const res = await request(app.getHttpServer() as App)
        .post("/users/login")
        .send({
          email: "john@example.com",
          password: "wrongpassword",
        });

      expect(res.status).toBe(400);
    });

    it("returns 400 for non-existent email", async () => {
      const res = await request(app.getHttpServer() as App)
        .post("/users/login")
        .send({
          email: "nobody@example.com",
          password: "password123",
        });

      expect(res.status).toBe(400);
    });

    it("returns 400 when email field is missing", async () => {
      const res = await request(app.getHttpServer() as App)
        .post("/users/login")
        .send({ password: "password123" });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /reviews", () => {
    let accessToken: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer() as App)
        .post("/users/login")
        .send({
          email: "john@example.com",
          password: "password123",
        });

      accessToken = res.body.access_token as string;
    });

    it("creates a review and returns 201 for an authenticated user", async () => {
      const res = await request(app.getHttpServer() as App)
        .post("/reviews")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          carVersionId,
          title: "Great daily driver",
          content: "This car is amazing for everyday use, very comfortable.",
          score: 4.5,
          pros: "Fuel efficient, spacious",
          cons: "Expensive maintenance",
        });

      expect(res.status).toBe(201);
      expect(res.body.review).toMatchObject({
        title: "Great daily driver",
        content: "This car is amazing for everyday use, very comfortable.",
        score: 4.5,
      });
      expect(res.body.review.slug).toBe("great-daily-driver");
    });

    it("returns 401 when no auth token is provided", async () => {
      const res = await request(app.getHttpServer() as App)
        .post("/reviews")
        .send({
          carVersionId,
          title: "Some review",
          content: "Content of the review that is long enough.",
          score: 3,
        });

      expect(res.status).toBe(401);
    });

    it("returns 400 when car version does not exist", async () => {
      const res = await request(app.getHttpServer() as App)
        .post("/reviews")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          carVersionId: "00000000-0000-0000-0000-000000000000",
          title: "Some review",
          content: "Content of the review that is long enough.",
          score: 3,
        });

      expect(res.status).toBe(400);
    });

    it("returns 400 when required fields are missing", async () => {
      const res = await request(app.getHttpServer() as App)
        .post("/reviews")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ carVersionId });

      expect(res.status).toBe(400);
    });
  });
});
