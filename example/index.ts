import { Elysia } from "elysia";
import { autoload } from "../src/index"; // Using source directly for example
import type { AutoloadedRoutes } from "./routes";

export const app = new Elysia()
	.use(
		await autoload<AutoloadedRoutes>({
			dir: "./example/routes",
			typegen: true,
		}),
	)
	.listen(3001);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
