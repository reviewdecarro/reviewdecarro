import { beforeEach, describe, expect, it } from "@jest/globals";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { InMemoryForumTopicsRepository } from "../repositories/in-memory-forum-topics.repository";
import { CreateForumTopicUseCase } from "./create-forum-topic.usecase";

describe("CreateForumTopicUseCase", () => {
	let topicsRepository: InMemoryForumTopicsRepository;
	let sut: CreateForumTopicUseCase;

	beforeEach(() => {
		topicsRepository = new InMemoryForumTopicsRepository();
		sut = new CreateForumTopicUseCase(topicsRepository);
	});

	it("should create a forum topic", async () => {
		const result = await sut.execute("user-1", {
			title: "Qual o melhor SUV?",
			content: "Estou pesquisando opções para família.",
		});

		expect(result).toHaveProperty("id");
		expect(result).toHaveProperty("authorId", "user-1");
		expect(result).toHaveProperty("title", "Qual o melhor SUV?");
		expect(result).toHaveProperty("slug", "qual-o-melhor-suv");
		expect(topicsRepository.items).toHaveLength(1);
		expect(topicsRepository.items[0]?.status).toBe("PUBLISHED");
	});

	it("should append a numeric suffix when slug already exists", async () => {
		await sut.execute("user-1", {
			title: "Qual o melhor SUV?",
			content: "Primeiro tópico.",
		});

		const result = await sut.execute("user-2", {
			title: "Qual o melhor SUV?",
			content: "Segundo tópico.",
		});

		expect(result).toHaveProperty("slug", "qual-o-melhor-suv-2");
	});

	it("should throw BadRequestError when title cannot generate a slug", async () => {
		await expect(
			sut.execute("user-1", {
				title: "   ",
				content: "Conteúdo válido.",
			}),
		).rejects.toThrow(BadRequestError);

		await expect(
			sut.execute("user-1", {
				title: "   ",
				content: "Conteúdo válido.",
			}),
		).rejects.toThrow("Cannot generate slug from title");
	});
});
