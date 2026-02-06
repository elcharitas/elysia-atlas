import { autoload } from "../src/index"; // Using source directly for example
import { createApp } from "./base";
import type { AutoloadedRoutes } from "./routes";
import type { AutoloadedRoutes as ExtraRoutes } from "./extra-routes";
import type { AutoloadedRoutes as DecoratedRoutes } from "./decorated-routes";

const extraRoutes = await autoload<ExtraRoutes>({
	dir: "./example/extra-routes",
	prefix: "/extra",
	typegen: "./example/extra-routes.d.ts",
});

const decoratedRoutes = await autoload<DecoratedRoutes>({
	dir: "./example/decorated-routes",
	prefix: "/v2",
	typegen: "./example/decorated-routes.d.ts",
});

export const app = createApp({ name: "test-app" as const })
	.use(
		await autoload<AutoloadedRoutes>({
			dir: "./example/routes",
			typegen: true,
		}),
	)
	.use(extraRoutes)
	.use(decoratedRoutes);

// Only listen when run directly
if (import.meta.main) {
	app.listen(3001);
	console.log(
		`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
	);
}

export type App = typeof app;
