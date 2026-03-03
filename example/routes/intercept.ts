import type { Elysia } from "elysia";

export default <T extends Elysia>(app: T) =>
	app.onBeforeHandle(({ set }) => {
		set.headers["X-Request-Time"] = new Date().toISOString();
	});
