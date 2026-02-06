import { t } from "elysia";
import type { BaseApp } from "../base";

export default (app: BaseApp) =>
	app
		.post(
			"",
			({ body }) => ({
				token: "mock-token",
				user: { id: "1", email: body.email },
			}),
			{
				body: t.Object({
					email: t.String({ format: "email" }),
					password: t.String({ minLength: 1 }),
				}),
			},
		);
