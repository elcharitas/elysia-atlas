import { t } from "elysia";
import type { BaseApp } from "../base";

export default (app: BaseApp) =>
	app
		.get("", () => [
			{ id: "1", type: "info", message: "Welcome", read: false },
			{ id: "2", type: "alert", message: "Update available", read: true },
		])
		.post("/:id/read", ({ params }) => ({ id: params.id, read: true }), {
			params: t.Object({ id: t.String() }),
		});
