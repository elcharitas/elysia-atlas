import type { Elysia } from "elysia";

export default <T extends Elysia>(app: T) =>
	app.onBeforeHandle(({ headers, set }) => {
		if (!headers.authorization) {
			set.status = 401;
			return { error: "Unauthorized" };
		}
	});
