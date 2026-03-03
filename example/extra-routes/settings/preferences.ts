import { t } from "elysia";
import type { BaseApp } from "../../base";

export default (app: BaseApp) =>
	app.put(
		"",
		({ body }) => ({
			updated: true,
			preferences: body,
		}),
		{
			body: t.Object({
				emailNotifications: t.Optional(t.Boolean()),
				darkMode: t.Optional(t.Boolean()),
				language: t.Optional(t.String()),
			}),
		},
	);
