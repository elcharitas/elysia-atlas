import { t } from "elysia";
import type { BaseApp } from "../../base";

export default (app: BaseApp) =>
	app.get(
		"",
		({ currentUser, query }) => {
			if (!currentUser) return { error: "Unauthorized" };
			return {
				items: [
					{ id: "1", name: "Item 1", price: 10 },
					{ id: "2", name: "Item 2", price: 20 },
				],
				page: query?.page ?? 1,
			};
		},
		{
			query: t.Optional(
				t.Object({
					page: t.Optional(t.Number()),
					category: t.Optional(t.String()),
				}),
			),
		},
	);
