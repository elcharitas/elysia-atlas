import type { BaseApp } from "../base";

export default (app: BaseApp) =>
	app.onBeforeHandle(({ set }) => {
		set.headers["X-Request-Time"] = new Date().toISOString();
	});
