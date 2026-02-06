import { Elysia, t } from "elysia";

export default <T extends Elysia>(app: T) =>
	app
		.get(
			"",
			({ query }) => {
				return {
					user: { id: "1", email: "test@test.com", name: "Test User" },
					session: { id: "session-1", expiresAt: new Date().toISOString() },
				};
			},
			{
				query: t.Optional(
					t.Object({
						disableCookieCache: t.Optional(t.Boolean()),
						disableRefresh: t.Optional(t.Boolean()),
					}),
				),
				detail: {
					tags: ["Auth"],
					description: "Get current session",
				},
			},
		)
		.get(
			"/all",
			() => {
				return {
					sessions: [
						{ id: "session-1", device: "Chrome", lastActive: new Date().toISOString() },
						{ id: "session-2", device: "Firefox", lastActive: new Date().toISOString() },
					],
				};
			},
			{
				detail: {
					tags: ["Auth"],
					description: "Get all active sessions",
				},
			},
		);
