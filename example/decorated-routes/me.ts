import type { BaseApp } from "../base";

export default (app: BaseApp) =>
	app.get("", ({ currentUser }) => {
		if (!currentUser) return { error: "Unauthorized" };
		return {
			user: currentUser,
			session: { id: "session-1", expiresAt: new Date().toISOString() },
		};
	});
