import { Elysia, t } from "elysia";

export default <T extends Elysia>(app: T) =>
	app.post(
		"",
		({ body }) => {
			return {
				user: {
					id: "new-user-id",
					email: body.email,
					name: body.name,
					firstName: body.firstName,
					lastName: body.lastName,
				},
				token: "mock-signup-token",
			};
		},
		{
			body: t.Object({
				email: t.String({ format: "email" }),
				password: t.String({ minLength: 8 }),
				name: t.String(),
				firstName: t.String(),
				lastName: t.String(),
			}),
			detail: {
				tags: ["Auth"],
				description: "Register a new user account",
			},
		},
	);
