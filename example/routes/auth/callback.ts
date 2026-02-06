import { Elysia, t } from "elysia";

export default <T extends Elysia>(app: T) =>
	app
		.get(
			"/:provider",
			({ params, query }) => {
				return {
					provider: params.provider,
					code: query?.code,
					redirectUrl: `/auth/success?provider=${params.provider}`,
				};
			},
			{
				params: t.Object({ provider: t.String() }),
				query: t.Optional(
					t.Object({
						code: t.Optional(t.String()),
						error: t.Optional(t.String()),
						state: t.Optional(t.String()),
					}),
				),
				detail: {
					tags: ["Auth"],
					description: "Handle OAuth callback (GET)",
				},
			},
		)
		.post(
			"/:provider",
			({ params, body }) => {
				return {
					provider: params.provider,
					code: body.code,
					processed: true,
				};
			},
			{
				params: t.Object({ provider: t.String() }),
				body: t.Object({
					code: t.Optional(t.String()),
					error: t.Optional(t.String()),
					state: t.Optional(t.String()),
				}),
				detail: {
					tags: ["Auth"],
					description: "Handle OAuth callback (POST)",
				},
			},
		);
