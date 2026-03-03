import type { BaseApp } from "../base";

export default (app: BaseApp) =>
	app.get("", () => ({ authenticated: true, userId: "123" }));
