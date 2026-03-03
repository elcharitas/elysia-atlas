import { t } from "elysia";
import type { BaseApp } from "../../base";

const settings: Record<string, string> = {
	siteName: "My App",
	theme: "dark",
	language: "en",
};

export default (app: BaseApp) =>
	app
		.get("", () => settings, {
			detail: {
				tags: ["Admin"],
				description: "Get all settings",
			},
		})
		.put(
			"",
			({ body }) => {
				Object.assign(settings, body);
				return settings;
			},
			{
				body: t.Object({
					siteName: t.Optional(t.String()),
					theme: t.Optional(t.Union([t.Literal("light"), t.Literal("dark")])),
					language: t.Optional(t.String()),
				}),
				detail: {
					tags: ["Admin"],
					description: "Update settings",
				},
			},
		);
