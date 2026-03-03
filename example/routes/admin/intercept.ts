import type { BaseApp } from "../../base";

export default (app: BaseApp) =>
	app.onBeforeHandle(({ headers, set }) => {
		if (!headers.authorization) {
			set.status = 401;
			return { error: "Unauthorized" };
		}
	});
