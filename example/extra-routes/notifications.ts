import { Elysia, t } from "elysia";

export default <T extends Elysia>(app: T) =>
	app
		.get("", () => [
			{ id: "1", type: "info", message: "Welcome", read: false },
			{ id: "2", type: "alert", message: "Update available", read: true },
		])
		.post(
			"/:id/read",
			({ params }) => ({ id: params.id, read: true }),
			{
				params: t.Object({ id: t.String() }),
			},
		);
