import { describe, expect, it } from "@jest/globals";
import { IS_PUBLIC_KEY } from "src/shared/decorators/is-public.decorator";
import { ForumController } from "./forum.controller";

describe("ForumController route visibility", () => {
	function isPublic(methodName: keyof ForumController): boolean {
		const handler = ForumController.prototype[methodName] as object;

		return Reflect.getMetadata(IS_PUBLIC_KEY, handler) === true;
	}

	it("should expose only list and detail routes as public", () => {
		expect(isPublic("listTopics")).toBe(true);
		expect(isPublic("findTopicBySlug")).toBe(true);
	});

	it("should require authentication for mutating routes", () => {
		expect(isPublic("createTopic")).toBe(false);
		expect(isPublic("createPost")).toBe(false);
		expect(isPublic("createReply")).toBe(false);
		expect(isPublic("voteTopic")).toBe(false);
		expect(isPublic("votePost")).toBe(false);
		expect(isPublic("deleteTopic")).toBe(false);
		expect(isPublic("deletePost")).toBe(false);
	});
});
