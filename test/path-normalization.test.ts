import { describe, expect, it } from "bun:test";
import { toRoutePath } from "../src/index";
import { toRouteLiteral, toTypeImportPath } from "../src/typegen";

describe("Path normalization - Windows semantics", () => {
	it("normalizes route paths with Windows separators in autoload", () => {
		expect(toRoutePath("admin\\settings.ts", "/api")).toBe(
			"/api/admin/settings",
		);
		expect(toRoutePath("admin\\index.ts", "/api")).toBe("/api/admin");
		expect(toRoutePath("auth\\[provider]\\index.ts", "/api")).toBe(
			"/api/auth/:provider",
		);
	});

	it("normalizes import specifiers for generated types", () => {
		expect(
			toTypeImportPath(
				"example/routes.d.ts",
				"example/routes",
				"admin\\settings.ts",
			),
		).toBe("./routes/admin/settings");
		expect(toTypeImportPath("routes.d.ts", "routes", "users.ts")).toBe(
			"./routes/users",
		);
	});

	it("normalizes route literals for generated types", () => {
		expect(toRouteLiteral("admin\\settings.ts", "/api")).toBe(
			"/api/admin/settings",
		);
		expect(toRouteLiteral("admin\\index.ts", "/api")).toBe("/api/admin");
		expect(toRouteLiteral("admin\\[section]\\index.ts", "/api")).toBe(
			"/api/admin/:section",
		);
	});
});
