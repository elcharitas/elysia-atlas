import { Elysia, t } from "elysia";

const users = [
	{ id: "1", name: "Elysia User", email: "user@elysia.dev", role: "admin" as const },
	{ id: "2", name: "John Doe", email: "john@example.com", role: "member" as const },
];

export default <T extends Elysia>(app: T) =>
	app
		.get("/user", () => ({ name: "Elysia User" }))
		.get("", ({ query }) => {
			const page = query?.page ?? 1;
			const limit = query?.limit ?? 10;
			return {
				users,
				pagination: {
					page,
					limit,
					total: users.length,
				},
			};
		}, {
			query: t.Optional(
				t.Object({
					page: t.Optional(t.Number()),
					limit: t.Optional(t.Number()),
					search: t.Optional(t.String()),
				}),
			),
			detail: {
				tags: ["Users"],
				description: "List all users with pagination",
			},
		})
		.get(
			"/:id",
			({ params }) => {
				const user = users.find((u) => u.id === params.id);
				if (!user) return { error: "User not found" };
				return user;
			},
			{
				params: t.Object({ id: t.String() }),
				detail: {
					tags: ["Users"],
					description: "Get a user by ID",
				},
			},
		)
		.post(
			"",
			({ body }) => {
				const newUser = { id: String(users.length + 1), ...body, role: "member" as const };
				users.push(newUser);
				return newUser;
			},
			{
				body: t.Object({
					name: t.String({ minLength: 1 }),
					email: t.String({ format: "email" }),
				}),
				detail: {
					tags: ["Users"],
					description: "Create a new user",
				},
			},
		)
		.patch(
			"/:id",
			({ params, body }) => {
				const user = users.find((u) => u.id === params.id);
				if (!user) return { error: "User not found" };
				Object.assign(user, body);
				return user;
			},
			{
				params: t.Object({ id: t.String() }),
				body: t.Object({
					name: t.Optional(t.String()),
					email: t.Optional(t.String({ format: "email" })),
				}),
				detail: {
					tags: ["Users"],
					description: "Update a user",
				},
			},
		);
