import { describe, expect, it } from "bun:test";
import {
	mkdirSync,
	mkdtempSync,
	rmSync,
	writeFileSync,
	readFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Elysia } from "elysia";
import { autoload } from "../src/index";

describe("Intercept - Root Level", () => {
	it("should apply root intercept to all routes", async () => {
		const app = new Elysia().use(await autoload({ dir: "./example/routes" }));

		const response = await app.handle(new Request("http://localhost/health"));
		expect(response.status).toBe(200);
		expect(response.headers.get("X-Request-Time")).toBeTruthy();
	});

	it("should apply root intercept to nested routes", async () => {
		const app = new Elysia().use(await autoload({ dir: "./example/routes" }));

		const response = await app.handle(
			new Request("http://localhost/auth/sign-out", { method: "POST" }),
		);
		expect(response.status).toBe(200);
		expect(response.headers.get("X-Request-Time")).toBeTruthy();
	});
});

describe("Intercept - Directory Level", () => {
	it("should apply admin intercept and block unauthenticated requests", async () => {
		const app = new Elysia().use(await autoload({ dir: "./example/routes" }));

		const response = await app.handle(
			new Request("http://localhost/admin/settings"),
		);
		expect(response.status).toBe(401);
		const data = await response.json();
		expect(data).toHaveProperty("error", "Unauthorized");
	});

	it("should allow authenticated requests through admin intercept", async () => {
		const app = new Elysia().use(await autoload({ dir: "./example/routes" }));

		const response = await app.handle(
			new Request("http://localhost/admin/settings", {
				headers: { Authorization: "Bearer test-token" },
			}),
		);
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data).toHaveProperty("siteName");
	});

	it("should apply admin intercept to deeply nested routes", async () => {
		const app = new Elysia().use(await autoload({ dir: "./example/routes" }));

		// Without auth → 401
		const unauth = await app.handle(
			new Request("http://localhost/admin/analytics/overview"),
		);
		expect(unauth.status).toBe(401);

		// With auth → 200
		const auth = await app.handle(
			new Request("http://localhost/admin/analytics/overview", {
				headers: { Authorization: "Bearer test-token" },
			}),
		);
		expect(auth.status).toBe(200);
	});

	it("should stack root and directory intercepts together", async () => {
		const app = new Elysia().use(await autoload({ dir: "./example/routes" }));

		// Admin routes should have both root intercept (X-Request-Time) and admin auth
		const response = await app.handle(
			new Request("http://localhost/admin/settings", {
				headers: { Authorization: "Bearer token" },
			}),
		);
		expect(response.status).toBe(200);
		expect(response.headers.get("X-Request-Time")).toBeTruthy();
	});

	it("should not apply admin intercept to non-admin routes", async () => {
		const app = new Elysia().use(await autoload({ dir: "./example/routes" }));

		const response = await app.handle(new Request("http://localhost/health"));
		expect(response.status).toBe(200);
	});
});

describe("Intercept - Custom Directory", () => {
	it("should load intercepts from a temporary directory structure", async () => {
		const tmpDir = mkdtempSync(join(tmpdir(), "atlas-intercept-"));

		writeFileSync(
			join(tmpDir, "intercept.ts"),
			`import { Elysia } from "elysia";
export default (app: Elysia) => app.onBeforeHandle(({ set }) => {
	set.headers["X-Custom-MW"] = "applied";
});`,
		);

		writeFileSync(
			join(tmpDir, "index.ts"),
			`import { Elysia } from "elysia";
export default (app: Elysia) => app.get("/", () => "hello");`,
		);

		mkdirSync(join(tmpDir, "protected"));
		writeFileSync(
			join(tmpDir, "protected", "intercept.ts"),
			`import { Elysia } from "elysia";
export default (app: Elysia) => app.onBeforeHandle(({ headers, set }) => {
	if (!headers["x-api-key"]) {
		set.status = 403;
		return { error: "Forbidden" };
	}
});`,
		);

		writeFileSync(
			join(tmpDir, "protected", "data.ts"),
			`import { Elysia } from "elysia";
export default (app: Elysia) => app.get("", () => ({ secret: true }));`,
		);

		try {
			const app = new Elysia().use(await autoload({ dir: tmpDir }));

			const rootRes = await app.handle(new Request("http://localhost/"));
			expect(rootRes.status).toBe(200);
			expect(rootRes.headers.get("X-Custom-MW")).toBe("applied");

			const forbiddenRes = await app.handle(
				new Request("http://localhost/protected/data"),
			);
			expect(forbiddenRes.status).toBe(403);

			const allowedRes = await app.handle(
				new Request("http://localhost/protected/data", {
					headers: { "X-Api-Key": "secret-key" },
				}),
			);
			expect(allowedRes.status).toBe(200);
			expect(allowedRes.headers.get("X-Custom-MW")).toBe("applied");
			expect(await allowedRes.json()).toEqual({ secret: true });
		} finally {
			rmSync(tmpDir, { recursive: true, force: true });
		}
	});

	it("should skip intercept.ts from route generation", async () => {
		const tmpDir = mkdtempSync(join(tmpdir(), "atlas-intercept-skip-"));

		writeFileSync(
			join(tmpDir, "intercept.ts"),
			`import { Elysia } from "elysia";
export default (app: Elysia) => app;`,
		);

		writeFileSync(
			join(tmpDir, "index.ts"),
			`import { Elysia } from "elysia";
export default (app: Elysia) => app.get("/", () => "ok");`,
		);

		try {
			const app = new Elysia().use(await autoload({ dir: tmpDir }));

			const interceptRouteRes = await app.handle(
				new Request("http://localhost/intercept"),
			);
			expect(interceptRouteRes.status).toBe(404);

			const indexRes = await app.handle(new Request("http://localhost/"));
			expect(indexRes.status).toBe(200);
		} finally {
			rmSync(tmpDir, { recursive: true, force: true });
		}
	});

	it("should throw if intercept.ts does not export a function", async () => {
		const tmpDir = mkdtempSync(join(tmpdir(), "atlas-intercept-bad-"));

		writeFileSync(
			join(tmpDir, "intercept.ts"),
			`export default "not a function";`,
		);

		writeFileSync(
			join(tmpDir, "index.ts"),
			`import { Elysia } from "elysia";
export default (app: Elysia) => app.get("/", () => "ok");`,
		);

		try {
			await expect(autoload({ dir: tmpDir })).rejects.toThrow(
				'intercept "intercept.ts" must export a function',
			);
		} finally {
			rmSync(tmpDir, { recursive: true, force: true });
		}
	});
});

describe("Intercept - Typegen Exclusion", () => {
	it("should not include intercept.ts in generated types", async () => {
		await autoload({
			dir: "./example/routes",
			typegen: true,
		});

		const content = readFileSync("./example/routes.d.ts", "utf-8");
		expect(content).not.toContain("intercept");
		expect(content).toContain("AutoloadedRoutes");
		expect(content).toContain("routes/health");
		expect(content).toContain("routes/admin/settings");
	});
});
