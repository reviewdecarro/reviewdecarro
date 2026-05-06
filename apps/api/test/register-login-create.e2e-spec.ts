import { randomUUID } from "node:crypto";
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
import { SessionEntity } from "../src/application/sessions/entities/session.entity";
import {
  CreateSessionData,
  SessionsRepositoryProps,
} from "../src/application/sessions/repositories/sessions.repository";
import { InMemoryUserTokensRepository } from "../src/application/users/repositories/in-memory-user-tokens.repository";
import { InMemoryUsersRepository } from "../src/application/users/repositories/in-memory-users.repository";
import { UserTokensRepositoryProps } from "../src/application/users/repositories/user-tokens.repository";
import { UsersRepositoryProps } from "../src/application/users/repositories/users.repository";
import { PrismaService } from "../src/infra/database/prisma/prisma.service";
import { BadRequestInterceptor } from "../src/shared/errors/interceptors/bad-request.interceptor";

class InMemorySessionsRepository extends SessionsRepositoryProps {
  public items: SessionEntity[] = [];

  async create(data: CreateSessionData): Promise<SessionEntity> {
    const session = new SessionEntity({
      id: randomUUID(),
      userId: data.userId,
      refreshToken: data.refreshTokenHash,
      userAgent: data.userAgent ?? null,
      ipAddress: data.ipAddress ?? null,
      isRevoked: false,
      expiresAt: data.expiresAt,
      createdAt: new Date(),
    });

    this.items.push(session);

    return session;
  }

  async findById(id: string): Promise<SessionEntity | null> {
    return this.items.find((session) => session.id === id) ?? null;
  }

  async revoke(id: string): Promise<void> {
    const session = this.items.find((item) => item.id === id);

    if (session) {
      session.isRevoked = true;
    }
  }

  async updateRefreshToken(
    id: string,
    refreshTokenHash: string,
  ): Promise<void> {
    const session = this.items.find((item) => item.id === id);

    if (session) {
      session.refreshToken = refreshTokenHash;
    }
  }
}

describe("Register → Login → Create Review (e2e)", () => {
  let app: INestApplication;
  let usersRepo: InMemoryUsersRepository;
  let userTokensRepo: InMemoryUserTokensRepository;
  let rolesRepo: InMemoryRolesRepository;
  let reviewsRepo: InMemoryReviewsRepository;
  let versionsRepo: InMemoryVersionsRepository;
  let sessionsRepo: InMemorySessionsRepository;
  let carVersionYearId: string;

  beforeAll(async () => {
    usersRepo = new InMemoryUsersRepository();
    userTokensRepo = new InMemoryUserTokensRepository();
    rolesRepo = new InMemoryRolesRepository();
    reviewsRepo = new InMemoryReviewsRepository();
    versionsRepo = new InMemoryVersionsRepository();
    sessionsRepo = new InMemorySessionsRepository();

    const version = await versionsRepo.create("model-uuid-1", {
      year: 2023,
      versionName: "Civic EX",
      engine: "2.0",
      transmission: "CVT",
      slug: "honda-civic-ex-2023",
    });
    carVersionYearId = version.years?.[0]?.id as string;

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
      .overrideProvider(SessionsRepositoryProps)
      .useValue(sessionsRepo)
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

  describe("POST /auth/login", () => {
    it("returns 200 with auth cookies for valid credentials", async () => {
      const res = await request(app.getHttpServer() as App)
        .post("/auth/login")
        .send({
          email: "john@example.com",
          password: "password123",
        });

      expect(res.status).toBe(200);
      expect(res.body.user).toMatchObject({
        username: "johndoe",
        email: "john@example.com",
      });
      expect(res.headers["set-cookie"]).toEqual(
        expect.arrayContaining([
          expect.stringContaining("papoauto_access_token="),
          expect.stringContaining("papoauto_refresh_token="),
          expect.stringContaining("papoauto_session_id="),
        ]),
      );
    });

    it("returns 400 for wrong password", async () => {
      const res = await request(app.getHttpServer() as App)
        .post("/auth/login")
        .send({
          email: "john@example.com",
          password: "wrongpassword",
        });

      expect(res.status).toBe(400);
    });

    it("returns 400 for non-existent email", async () => {
      const res = await request(app.getHttpServer() as App)
        .post("/auth/login")
        .send({
          email: "nobody@example.com",
          password: "password123",
        });

      expect(res.status).toBe(400);
    });

    it("returns 400 when email field is missing", async () => {
      const res = await request(app.getHttpServer() as App)
        .post("/auth/login")
        .send({ password: "password123" });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /reviews", () => {
    let cookies: string[];

    beforeAll(async () => {
      const res = await request(app.getHttpServer() as App)
        .post("/auth/login")
        .send({
          email: "john@example.com",
          password: "password123",
        });

      cookies = res.headers["set-cookie"] as string[];
    });

    it("creates a review and returns 201 for an authenticated user", async () => {
      const res = await request(app.getHttpServer() as App)
        .post("/reviews")
        .set("Cookie", cookies)
        .send({
          carVersionYearId,
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
          carVersionYearId,
          title: "Some review",
          content: "Content of the review that is long enough.",
          score: 3,
        });

      expect(res.status).toBe(401);
    });

    it("returns 400 when car version does not exist", async () => {
      const res = await request(app.getHttpServer() as App)
        .post("/reviews")
        .set("Cookie", cookies)
        .send({
          carVersionYearId: "00000000-0000-0000-0000-000000000000",
          title: "Some review",
          content: "Content of the review that is long enough.",
          score: 3,
        });

      expect(res.status).toBe(400);
    });

    it("returns 400 when required fields are missing", async () => {
      const res = await request(app.getHttpServer() as App)
        .post("/reviews")
        .set("Cookie", cookies)
        .send({ carVersionYearId });

      expect(res.status).toBe(400);
    });
  });
});
