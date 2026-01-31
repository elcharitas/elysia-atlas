import Elysia from "elysia";
import { join, resolve } from "node:path";

export async function autoload<T = Elysia>(options: {
	dir: string;
	prefix?: string;
	typegen?: boolean | string;
}): Promise<T> {
	if (options.typegen) {
		const { generateTypes } = await import("./typegen");
		const output =
			typeof options.typegen === "string"
				? options.typegen
				: join(options.dir, "../routes.d.ts");

		await generateTypes({
			dir: options.dir,
			prefix: options.prefix,
			output,
		});
	}

	const app = new Elysia({
		name: "autoload",
		seed: options.dir,
	});

	for await (const path of new Bun.Glob("**/*.ts").scan({ cwd: options.dir })) {
		if (path.endsWith(".d.ts")) continue;

		const module = await import(resolve(options.dir, path));

		if (typeof module.default !== "function")
			throw new Error(`autoload: "${path}" must export a function`);

		app.group(
			join(options.prefix ?? "/", path).replace(/\/index\.ts$|\.ts$/, ""),
			module.default,
		);
	}

	return app as T;
}
