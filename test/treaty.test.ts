import { describe, expect, it } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { Elysia } from "elysia";
import { app } from "../example";
import { autoload } from "../src/index";
import type { AutoloadedRoutes } from "../example/routes";

describe("Treaty - Basic", () => {
	it("should work with treaty for index route", async () => {
		const client = treaty<typeof app>(app);

		const { data: indexData, error: indexError } = await client.get();
		expect(indexError).toBeNull();
		expect(indexData).toBe("Hello from Example!");
	});

	it("should work with treaty for nested user route", async () => {
		const client = treaty<typeof app>(app);

		const { data: userData, error: userError } = await client.users.user.get();
		expect(userError).toBeNull();
		expect(userData).toEqual({ name: "Elysia User" });
	});
});

describe("Treaty - Complex Routes", () => {
	it("should access health endpoint via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.health.get();
		expect(error).toBeNull();
		expect(data).toHaveProperty("status", "ok");
		expect(data).toHaveProperty("timestamp");
	});

	it("should access posts list via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.posts.get();
		expect(error).toBeNull();
		expect(data).toBeArray();
	});

	it("should create a post via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.posts.post({
			title: "Treaty Post",
			content: "Created via treaty",
			authorId: "1",
		});
		expect(error).toBeNull();
		expect(data).toHaveProperty("title", "Treaty Post");
		expect(data).toHaveProperty("id");
	});

	it("should access post by ID via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.posts({ id: "1" }).get();
		expect(error).toBeNull();
		expect(data).toHaveProperty("id", "1");
	});

	it("should update a post via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.posts({ id: "1" }).put({
			title: "Updated via Treaty",
		});
		expect(error).toBeNull();
		expect(data).toHaveProperty("title", "Updated via Treaty");
	});

	it("should list users with pagination via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.users.get();
		expect(error).toBeNull();
		expect(data).toHaveProperty("users");
		expect(data).toHaveProperty("pagination");
	});

	it("should create a user via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.users.post({
			name: "New User",
			email: "new@test.com",
		});
		expect(error).toBeNull();
		expect(data).toHaveProperty("name", "New User");
	});

	it("should get user by ID via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.users({ id: "1" }).get();
		expect(error).toBeNull();
		expect(data).toHaveProperty("id", "1");
	});

	it("should patch a user via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.users({ id: "1" }).patch({
			name: "Patched Name",
		});
		expect(error).toBeNull();
		expect(data).toHaveProperty("name", "Patched Name");
	});
});

describe("Treaty - Nested Directory Routes", () => {
	it("should access auth/sign-in via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.auth["sign-in"].post({
			email: "test@test.com",
			password: "password123",
		});
		expect(error).toBeNull();
		expect(data).toHaveProperty("token");
		expect(data).toHaveProperty("user");
	});

	it("should access auth/sign-up via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.auth["sign-up"].post({
			email: "new@test.com",
			password: "password123456",
			name: "New User",
			firstName: "New",
			lastName: "User",
		});
		expect(error).toBeNull();
		expect(data).toHaveProperty("user");
	});

	it("should access auth/sign-out via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.auth["sign-out"].post();
		expect(error).toBeNull();
		expect(data).toHaveProperty("success", true);
	});

	it("should access auth/session via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.auth.session.get();
		expect(error).toBeNull();
		expect(data).toHaveProperty("user");
		expect(data).toHaveProperty("session");
	});

	it("should access auth/session/all via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.auth.session.all.get();
		expect(error).toBeNull();
		expect(data).toHaveProperty("sessions");
	});

	it("should access auth/callback/:provider GET via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.auth
			.callback({ provider: "google" })
			.get({ query: { code: "abc123" } });
		expect(error).toBeNull();
		expect(data).toHaveProperty("provider", "google");
	});

	it("should access auth/callback/:provider POST via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.auth
			.callback({ provider: "github" })
			.post({ code: "xyz789" });
		expect(error).toBeNull();
		expect(data).toHaveProperty("provider", "github");
		expect(data).toHaveProperty("processed", true);
	});

	it("should access auth/verify-email via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.auth["verify-email"].post({
			email: "test@test.com",
			otp: "123456",
		});
		expect(error).toBeNull();
		expect(data).toHaveProperty("verified", true);
	});

	it("should access admin/settings via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.admin.settings.get();
		expect(error).toBeNull();
		expect(data).toHaveProperty("siteName");
		expect(data).toHaveProperty("theme");
	});

	it("should update admin/settings via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.admin.settings.put({
			theme: "dark",
		});
		expect(error).toBeNull();
		expect(data).toHaveProperty("theme", "dark");
	});

	it("should access 3-level deep admin/analytics/overview via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.admin.analytics.overview.get();
		expect(error).toBeNull();
		expect(data).toHaveProperty("totalUsers");
		expect(data).toHaveProperty("activeUsers");
	});

	it("should access dynamic admin/analytics/[section] via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.admin
			.analytics({ section: "users" })
			.get();
		expect(error).toBeNull();
		expect(data).toHaveProperty("totalUsers", 1250);
		expect(data).toHaveProperty("activeUsers", 420);
		expect(data).toHaveProperty("newSignups", 35);
		expect(data).toHaveProperty("period", "7d");
	});

	it("should access dynamic admin/analytics/[section] with query params via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.admin
			.analytics({ section: "revenue" })
			.get({
				query: { period: "30d" },
			});
		expect(error).toBeNull();
		expect(data).toHaveProperty("totalUsers", 1250);
		expect(data).toHaveProperty("activeUsers", 420);
		expect(data).toHaveProperty("newSignups", 35);
		expect(data).toHaveProperty("period", "30d");
	});
});

describe("Treaty - With Prefix", () => {
	it("should work with treaty and prefix", async () => {
		const routes = await autoload<AutoloadedRoutes>({
			dir: "./example/routes",
			prefix: "/api",
			typegen: "./example/api-routes.d.ts",
		});

		const prefixedApp = new Elysia().use(routes);

		const response = await prefixedApp.handle(
			new Request("http://localhost/api/users/user"),
		);
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ name: "Elysia User" });
	});
});

describe("Treaty - SDK Pattern", () => {
	it("should work with SDK wrapper pattern", async () => {
		type AppType = typeof app;

		const createSdk = (domain: string | AppType) => {
			const client = treaty<AppType>(domain as any);
			return client;
		};

		const sdk = createSdk(app);

		// Test various endpoints through SDK
		const { data: indexData, error: indexError } = await sdk.get();
		expect(indexError).toBeNull();
		expect(indexData).toBe("Hello from Example!");

		const { data: healthData, error: healthError } = await sdk.health.get();
		expect(healthError).toBeNull();
		expect(healthData).toHaveProperty("status", "ok");
	});

	it("should work with proxy-based SDK pattern", async () => {
		type AppType = typeof app;

		const createClient = (url: string | AppType) => {
			const client = treaty<AppType>(url);
			return new Proxy({} as typeof client, {
				get(_, prop) {
					return Reflect.get(client, prop);
				},
			});
		};

		const sdk = createClient(app);

		const { data, error } = await sdk.health.get();
		expect(error).toBeNull();
		expect(data).toHaveProperty("status", "ok");

		const { data: signInData, error: signInError } = await sdk.auth[
			"sign-in"
		].post({
			email: "test@test.com",
			password: "password123",
		});
		expect(signInError).toBeNull();
		expect(signInData).toHaveProperty("token");
	});
});

describe("Treaty - Extra Routes (Second Autoload with Prefix)", () => {
	it("should access extra/profile via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.extra.profile.get();
		expect(error).toBeNull();
		expect(data).toHaveProperty("authenticated", true);
		expect(data).toHaveProperty("userId");
	});

	it("should access extra/notifications via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.extra.notifications.get();
		expect(error).toBeNull();
		expect(data).toBeArray();
	});

	it("should access extra/settings/preferences via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.extra.settings.preferences.put({
			darkMode: true,
			language: "en",
		});
		expect(error).toBeNull();
		expect(data).toHaveProperty("updated", true);
	});
});

describe("Treaty - Decorated Routes (Third Autoload with Prefix + BaseApp)", () => {
	it("should access v2/me via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.v2.me.get();
		expect(error).toBeNull();
		expect(data).toBeDefined();
	});

	it("should access v2/login via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.v2.login.post({
			email: "test@test.com",
			password: "password123",
		});
		expect(error).toBeNull();
		expect(data).toHaveProperty("token");
	});

	it("should access v2/register via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.v2.register.post({
			email: "new@test.com",
			password: "password123",
			name: "Test User",
		});
		expect(error).toBeNull();
		expect(data).toHaveProperty("user");
	});

	it("should access v2/catalog/items via treaty", async () => {
		const client = treaty<typeof app>(app);

		const { data, error } = await client.v2.catalog.items.get();
		expect(error).toBeNull();
		expect(data).toBeDefined();
	});
});
