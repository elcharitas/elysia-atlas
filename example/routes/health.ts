import type { BaseApp } from "../base";

export default (app: BaseApp) =>
	app.get("", () => ({
		status: "ok",
		timestamp: new Date().toISOString(),
	}));
