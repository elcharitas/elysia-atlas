import { describe, expect, it } from "bun:test";
import { Elysia } from "elysia";
import { autoload } from "../src/index";

describe("Autoload", () => {
	it("should autoload routes from directory", async () => {
		const app = new Elysia().use(
			await autoload({
				dir: "./example/routes",
			}),
		);

		const response = await app.handle(new Request("http://localhost/"));
		expect(await response.text()).toBe("Hello from Example!");
	});

	it("should handle prefixes", async () => {
		const app = new Elysia().use(
			await autoload({
				dir: "./example/routes",
				prefix: "/api",
			}),
		);

		const response = await app.handle(new Request("http://localhost/api"));
		expect(await response.text()).toBe("Hello from Example!");
	});

	it("should handle nested routes", async () => {
		const app = new Elysia().use(
			await autoload({
				dir: "./example/routes",
			}),
		);

		const responseUser = await app.handle(
			new Request("http://localhost/users/user"),
		);
		expect(responseUser.status).toBe(200);
		expect(await responseUser.json()).toEqual({ name: "Elysia User" });
	});
});
