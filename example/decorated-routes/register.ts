import { t } from "elysia";
import type { BaseApp } from "../base";

export default (app: BaseApp) =>
	app.post(
		"",
		({ body }) => ({
			user: { id: "new-id", email: body.email, name: body.name },
		}),
		{
			body: t.Object({
				email: t.String({ format: "email" }),
				password: t.String({ minLength: 8 }),
				name: t.String(),
			}),
		},
	);
