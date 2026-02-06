import { Elysia, t } from "elysia";

export default <T extends Elysia>(app: T) =>
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
