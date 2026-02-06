import { describe, expect, it } from "bun:test";
import { Elysia } from "elysia";
import { autoload } from "../src/index";

describe("Autoload - Basic", () => {
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

describe("Autoload - Complex Routes", () => {
	it("should handle health endpoint returning JSON", async () => {
		const app = new Elysia().use(
			await autoload({ dir: "./example/routes" }),
		);

		const response = await app.handle(new Request("http://localhost/health"));
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data).toHaveProperty("status", "ok");
		expect(data).toHaveProperty("timestamp");
	});

	it("should handle GET with query parameters", async () => {
		const app = new Elysia().use(
			await autoload({ dir: "./example/routes" }),
		);

		const response = await app.handle(
			new Request("http://localhost/users?page=2&limit=5"),
		);
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data).toHaveProperty("users");
		expect(data).toHaveProperty("pagination");
	});

	it("should handle POST with body validation", async () => {
		const app = new Elysia().use(
			await autoload({ dir: "./example/routes" }),
		);

		const response = await app.handle(
			new Request("http://localhost/posts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: "Test Post",
					content: "Test Content",
					authorId: "1",
					tags: ["test"],
				}),
			}),
		);
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data).toHaveProperty("title", "Test Post");
		expect(data).toHaveProperty("id");
	});

	it("should handle PUT with params and body", async () => {
		const app = new Elysia().use(
			await autoload({ dir: "./example/routes" }),
		);

		const response = await app.handle(
			new Request("http://localhost/posts/1", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: "Updated Title",
				}),
			}),
		);
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data).toHaveProperty("title", "Updated Title");
	});

	it("should handle DELETE with params", async () => {
		const app = new Elysia().use(
			await autoload({ dir: "./example/routes" }),
		);

		const response = await app.handle(
			new Request("http://localhost/posts/2", {
				method: "DELETE",
			}),
		);
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data).toHaveProperty("deleted", true);
	});

	it("should handle PATCH with params and body", async () => {
		const app = new Elysia().use(
			await autoload({ dir: "./example/routes" }),
		);

		const response = await app.handle(
			new Request("http://localhost/users/1", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: "Updated Name",
				}),
			}),
		);
		expect(response.status).toBe(200);
	});
});

describe("Autoload - Nested Directories", () => {
	it("should handle 2-level nested routes (auth/sign-in)", async () => {
		const app = new Elysia().use(
			await autoload({ dir: "./example/routes" }),
		);

		const response = await app.handle(
			new Request("http://localhost/auth/sign-in", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: "test@test.com",
					password: "password123",
				}),
			}),
		);
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data).toHaveProperty("token");
		expect(data).toHaveProperty("user");
	});

	it("should handle 2-level nested routes (auth/sign-up)", async () => {
		const app = new Elysia().use(
			await autoload({ dir: "./example/routes" }),
		);

		const response = await app.handle(
			new Request("http://localhost/auth/sign-up", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: "new@test.com",
					password: "password123456",
					name: "New User",
					firstName: "New",
					lastName: "User",
				}),
			}),
		);
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data).toHaveProperty("user");
		expect(data.user).toHaveProperty("email", "new@test.com");
	});

	it("should handle 2-level nested routes (auth/sign-out)", async () => {
		const app = new Elysia().use(
			await autoload({ dir: "./example/routes" }),
		);

		const response = await app.handle(
			new Request("http://localhost/auth/sign-out", {
				method: "POST",
			}),
		);
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data).toHaveProperty("success", true);
	});

	it("should handle 2-level nested routes with multiple sub-routes (auth/session)", async () => {
		const app = new Elysia().use(
			await autoload({ dir: "./example/routes" }),
		);

		// Test GET session
		const sessionRes = await app.handle(
			new Request("http://localhost/auth/session"),
		);
		expect(sessionRes.status).toBe(200);
		const sessionData = await sessionRes.json();
		expect(sessionData).toHaveProperty("user");
		expect(sessionData).toHaveProperty("session");

		// Test GET session/all
		const allSessionsRes = await app.handle(
			new Request("http://localhost/auth/session/all"),
		);
		expect(allSessionsRes.status).toBe(200);
		const allSessionsData = await allSessionsRes.json();
		expect(allSessionsData).toHaveProperty("sessions");
	});

	it("should handle 2-level nested routes with path params (auth/callback)", async () => {
		const app = new Elysia().use(
			await autoload({ dir: "./example/routes" }),
		);

		// Test GET callback/:provider
		const getRes = await app.handle(
			new Request("http://localhost/auth/callback/google?code=abc123"),
		);
		expect(getRes.status).toBe(200);
		const getData = await getRes.json();
		expect(getData).toHaveProperty("provider", "google");

		// Test POST callback/:provider
		const postRes = await app.handle(
			new Request("http://localhost/auth/callback/github", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code: "xyz789" }),
			}),
		);
		expect(postRes.status).toBe(200);
		const postData = await postRes.json();
		expect(postData).toHaveProperty("provider", "github");
		expect(postData).toHaveProperty("processed", true);
	});

	it("should handle 2-level nested routes (auth/verify-email)", async () => {
		const app = new Elysia().use(
			await autoload({ dir: "./example/routes" }),
		);

		const response = await app.handle(
			new Request("http://localhost/auth/verify-email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: "test@test.com",
					otp: "123456",
				}),
			}),
		);
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data).toHaveProperty("verified", true);
	});

	it("should handle 2-level nested routes (admin/settings)", async () => {
		const app = new Elysia().use(
			await autoload({ dir: "./example/routes" }),
		);

		// GET settings
		const getRes = await app.handle(
			new Request("http://localhost/admin/settings"),
		);
		expect(getRes.status).toBe(200);
		const settings = await getRes.json();
		expect(settings).toHaveProperty("siteName");
		expect(settings).toHaveProperty("theme");

		// PUT settings
		const putRes = await app.handle(
			new Request("http://localhost/admin/settings", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					theme: "light",
				}),
			}),
		);
		expect(putRes.status).toBe(200);
		const updated = await putRes.json();
		expect(updated).toHaveProperty("theme", "light");
	});

	it("should handle 3-level nested routes (admin/analytics/overview)", async () => {
		const app = new Elysia().use(
			await autoload({ dir: "./example/routes" }),
		);

		const response = await app.handle(
			new Request("http://localhost/admin/analytics/overview?period=30d"),
		);
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data).toHaveProperty("totalUsers");
		expect(data).toHaveProperty("activeUsers");
		expect(data).toHaveProperty("period", "30d");
	});
});

describe("Autoload - With Prefix", () => {
	it("should prefix all routes including nested", async () => {
		const app = new Elysia().use(
			await autoload({
				dir: "./example/routes",
				prefix: "/api/v1",
			}),
		);

		// Root index route at /api/v1
		const indexRes = await app.handle(new Request("http://localhost/api/v1"));
		expect(indexRes.status).toBe(200);
		expect(await indexRes.text()).toBe("Hello from Example!");

		// Nested route at /api/v1/auth/sign-in
		const signInRes = await app.handle(
			new Request("http://localhost/api/v1/auth/sign-in", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: "test@test.com",
					password: "password123",
				}),
			}),
		);
		expect(signInRes.status).toBe(200);

		// 3-level nested at /api/v1/admin/analytics/overview
		const analyticsRes = await app.handle(
			new Request("http://localhost/api/v1/admin/analytics/overview"),
		);
		expect(analyticsRes.status).toBe(200);
	});

	it("should work correctly when used with .use() on another Elysia instance", async () => {
		const routes = await autoload({
			dir: "./example/routes",
			prefix: "/api",
		});

		const app = new Elysia()
			.get("/root", () => "root")
			.use(routes);

		// Root app route
		const rootRes = await app.handle(new Request("http://localhost/root"));
		expect(rootRes.status).toBe(200);
		expect(await rootRes.text()).toBe("root");

		// Autoloaded route with prefix
		const apiRes = await app.handle(new Request("http://localhost/api"));
		expect(apiRes.status).toBe(200);
		expect(await apiRes.text()).toBe("Hello from Example!");
	});
});

describe("Autoload - Typegen", () => {
	it("should generate type definitions file", async () => {
		await autoload({
			dir: "./example/routes",
			typegen: true,
		});

		const file = Bun.file("./example/routes.d.ts");
		expect(await file.exists()).toBe(true);

		const content = await file.text();
		expect(content).toContain("AutoloadedRoutes");
		expect(content).toContain("WithBasePath");
		// Should contain all route files
		expect(content).toContain("routes/index");
		expect(content).toContain("routes/users");
		expect(content).toContain("routes/posts");
		expect(content).toContain("routes/health");
		expect(content).toContain("routes/auth/sign-in");
		expect(content).toContain("routes/auth/sign-up");
		expect(content).toContain("routes/auth/sign-out");
		expect(content).toContain("routes/auth/session");
		expect(content).toContain("routes/auth/callback");
		expect(content).toContain("routes/auth/verify-email");
		expect(content).toContain("routes/admin/settings");
		expect(content).toContain("routes/admin/analytics/overview");
	});

	it("should generate type definitions with custom output path", async () => {
		await autoload({
			dir: "./example/routes",
			typegen: "./example/custom-routes.d.ts",
		});

		const file = Bun.file("./example/custom-routes.d.ts");
		expect(await file.exists()).toBe(true);

		const content = await file.text();
		expect(content).toContain("AutoloadedRoutes");
	});

	it("should generate correct prefixed paths in typegen", async () => {
		await autoload({
			dir: "./example/routes",
			prefix: "/api",
			typegen: "./example/api-routes.d.ts",
		});

		const content = await Bun.file("./example/api-routes.d.ts").text();
		expect(content).toContain('"/api"');
		expect(content).toContain('"/api/users"');
		expect(content).toContain('"/api/auth/sign-in"');
		expect(content).toContain('"/api/admin/analytics/overview"');
	});
});
