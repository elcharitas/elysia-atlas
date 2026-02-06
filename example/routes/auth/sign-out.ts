import type { Elysia } from "elysia";

export default <T extends Elysia>(app: T) =>
	app.post("", () => ({ success: true }), {
		detail: {
			tags: ["Auth"],
			description: "Sign out the current user",
		},
	});
