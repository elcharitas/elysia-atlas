import { Elysia } from "elysia";

/**
 * An Elysia instance enriched with plugins (derive, state, etc.)
 * that changes the type signature.
 */
export const createApp = <P extends string>(config?: {
	name?: P;
	version?: string;
}) => {
	const app = new Elysia({ name: config?.name, seed: config?.name })
		.state("startTime", Date.now())
		.derive(({ headers }) => {
			return {
				currentUser: headers.authorization
					? { id: "user-1", role: "admin" as const }
					: null,
			};
		})
		.onError(({ code, error }) => {
			if (typeof code === "string" && code !== "UNKNOWN") {
				return { code, message: error.message };
			}
		});
	return app;
};

export type BaseApp = ReturnType<typeof createApp>;
