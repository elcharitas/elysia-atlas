import type { BaseApp } from "../../base";

export default (app: BaseApp) =>
	app.post("", () => ({ success: true }), {
		detail: {
			tags: ["Auth"],
			description: "Sign out the current user",
		},
	});
