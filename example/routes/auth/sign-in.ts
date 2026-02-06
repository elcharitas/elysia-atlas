import { Elysia, t } from "elysia";

export default <T extends Elysia>(app: T) =>
	app.post(
		"",
		({ body }) => {
			if (body.email === "test@test.com" && body.password === "password123") {
				return {
					token: "mock-jwt-token",
					user: { id: "1", email: body.email, name: "Test User" },
				};
			}
			return { error: "Invalid credentials" };
		},
		{
			body: t.Object({
				email: t.String({ format: "email" }),
				password: t.String({ minLength: 1 }),
				rememberMe: t.Optional(t.Boolean()),
			}),
			detail: {
				tags: ["Auth"],
				description: "Sign in with email and password",
			},
		},
	);
