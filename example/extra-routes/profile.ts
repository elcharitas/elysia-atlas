import type { Elysia } from "elysia";

export default <T extends Elysia>(app: T) =>
	app.get("", () => ({ authenticated: true, userId: "123" }));
