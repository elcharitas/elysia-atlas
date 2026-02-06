import { Elysia, t } from "elysia";

const posts = [
	{ id: "1", title: "First Post", content: "Hello World", authorId: "1", tags: ["intro"] },
	{ id: "2", title: "Second Post", content: "More content", authorId: "2", tags: ["update"] },
];

export default <T extends Elysia>(app: T) =>
	app
		.get("", () => posts, {
			detail: {
				tags: ["Posts"],
				description: "List all posts",
			},
		})
		.get(
			"/:id",
			({ params }) => {
				const post = posts.find((p) => p.id === params.id);
				if (!post) return { error: "Not found" };
				return post;
			},
			{
				params: t.Object({
					id: t.String(),
				}),
				detail: {
					tags: ["Posts"],
					description: "Get a post by ID",
				},
			},
		)
		.post(
			"",
			({ body }) => {
				const newPost = { id: String(posts.length + 1), ...body, tags: body.tags ?? [] };
				posts.push(newPost);
				return newPost;
			},
			{
				body: t.Object({
					title: t.String({ minLength: 1 }),
					content: t.String(),
					authorId: t.String(),
					tags: t.Optional(t.Array(t.String())),
				}),
				detail: {
					tags: ["Posts"],
					description: "Create a new post",
				},
			},
		)
		.put(
			"/:id",
			({ params, body }) => {
				const idx = posts.findIndex((p) => p.id === params.id);
				if (idx === -1) return { error: "Not found" };
				posts[idx] = { ...posts[idx], ...body };
				return posts[idx];
			},
			{
				params: t.Object({ id: t.String() }),
				body: t.Object({
					title: t.Optional(t.String()),
					content: t.Optional(t.String()),
					tags: t.Optional(t.Array(t.String())),
				}),
				detail: {
					tags: ["Posts"],
					description: "Update a post",
				},
			},
		)
		.delete(
			"/:id",
			({ params }) => {
				const idx = posts.findIndex((p) => p.id === params.id);
				if (idx === -1) return { error: "Not found" };
				const [deleted] = posts.splice(idx, 1);
				return { deleted: true, id: deleted.id };
			},
			{
				params: t.Object({ id: t.String() }),
				detail: {
					tags: ["Posts"],
					description: "Delete a post",
				},
			},
		);
