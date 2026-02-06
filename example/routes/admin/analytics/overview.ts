import { Elysia, t } from "elysia";

export default <T extends Elysia>(app: T) =>
	app.get(
		"",
		({ query }) => {
			return {
				totalUsers: 1250,
				activeUsers: 420,
				newSignups: 35,
				period: query?.period ?? "7d",
			};
		},
		{
			query: t.Optional(
				t.Object({
					period: t.Optional(
						t.Union([
							t.Literal("1d"),
							t.Literal("7d"),
							t.Literal("30d"),
							t.Literal("90d"),
						]),
					),
				}),
			),
			detail: {
				tags: ["Admin", "Analytics"],
				description: "Get analytics overview",
			},
		},
	);
