import { describe, expect, it } from "@jest/globals";
import { ROLES_KEY } from "src/infra/auth/decorators/roles.decorator";
import { UsersController } from "./users.controller";

describe("UsersController route authorization", () => {
	function getRoles(methodName: keyof UsersController): string[] | undefined {
		const handler = UsersController.prototype[methodName] as object;
		return Reflect.getMetadata(ROLES_KEY, handler);
	}

	it("should require admin role for deleteAccountById", () => {
		expect(getRoles("deleteAccountById")).toEqual(["admin"]);
	});

	it("should not restrict deleteAccount to any role", () => {
		expect(getRoles("deleteAccount")).toBeUndefined();
	});
});
